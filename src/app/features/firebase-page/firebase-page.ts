import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { initializeApp, getApps, deleteApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  EmailAuthProvider,
  PhoneAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import * as firebaseui from 'firebaseui';
import { environment } from '../../../environments/environment.dev';

export interface FirebaseConfigInput {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface UIEventLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error';
  message: string;
}

const DEFAULT_DEMO_CONFIG: FirebaseConfigInput = {
  apiKey: 'AIzaSyDemoKeyForTestingFirebaseUI12345',
  authDomain: 'poc-web-app-demo.firebaseapp.com',
  projectId: 'poc-web-app-demo',
  storageBucket: 'poc-web-app-demo.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:demo1234567890abcdef',
};

// Firebase config resolution (env-injected vs. demo fallback)
function isInjectedFirebaseConfig(config: FirebaseConfigInput): boolean {
  return !config.apiKey.startsWith('__');
}

const INITIAL_CONFIG: FirebaseConfigInput = isInjectedFirebaseConfig(environment.firebaseConfig)
  ? environment.firebaseConfig
  : DEFAULT_DEMO_CONFIG;

const STORAGE_KEY = 'poc_firebase_ui_config';

@Component({
  selector: 'app-firebase-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './firebase-page.html',
  styleUrl: './firebase-page.scss',
})
export class FirebasePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('authContainer') authContainerRef!: ElementRef<HTMLDivElement>;

  protected activeTab = signal<'ui' | 'config' | 'user' | 'docs'>('ui');

  // Firebase state
  protected config = signal<FirebaseConfigInput>({ ...INITIAL_CONFIG });
  protected isDemoConfig = computed(() => this.config().apiKey.includes('DemoKey') || !this.config().apiKey);
  protected isInitialized = signal<boolean>(false);
  protected currentUser = signal<User | null>(null);
  protected isMockUser = signal<boolean>(false);
  protected mockUser = signal<{
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    providerId: string;
    emailVerified: boolean;
  } | null>(null);

  // UI options
  protected signInFlow = signal<'popup' | 'redirect'>('popup');
  protected enableEmail = signal<boolean>(true);
  protected enableGoogle = signal<boolean>(true);
  protected enablePhone = signal<boolean>(true);
  protected enableAnonymous = signal<boolean>(true);
  protected enableGithub = signal<boolean>(true);
  protected requireDisplayName = signal<boolean>(true);

  // Status & Logs
  protected uiStatusMessage = signal<string>('FirebaseUI is ready to launch');
  protected eventLogs = signal<UIEventLog[]>([]);
  protected rawIdToken = signal<string>('');

  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private uiInstance: firebaseui.auth.AuthUI | null = null;
  private authUnsubscribe: (() => void) | null = null;

  ngOnInit(): void {
    this.loadSavedConfig();
    this.addLog('info', 'FirebaseUI Page initialized.');
  }

  ngAfterViewInit(): void {
    this.initFirebaseApp();
  }

  ngOnDestroy(): void {
    if (this.authUnsubscribe) {
      this.authUnsubscribe();
    }
    this.cleanupUI();
  }

  protected loadSavedConfig(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.config.set({ ...INITIAL_CONFIG, ...parsed });
        this.addLog('info', 'Loaded saved Firebase config from localStorage.');
      }
    } catch {
      this.config.set({ ...INITIAL_CONFIG });
    }
  }

  protected saveConfig(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config()));
      this.addLog('success', 'Firebase config saved to localStorage!');
      this.initFirebaseApp();
    } catch (e: any) {
      this.addLog('error', `Failed to save config: ${e.message}`);
    }
  }

  protected resetConfigToDemo(): void {
    this.config.set({ ...DEFAULT_DEMO_CONFIG });
    localStorage.removeItem(STORAGE_KEY);
    this.addLog('info', 'Reset config to demo defaults.');
    this.initFirebaseApp();
  }

  protected async initFirebaseApp(): Promise<void> {
    try {
      this.cleanupUI();

      const currentConfig = this.config();
      if (!currentConfig.apiKey || currentConfig.apiKey.includes('DemoKey')) {
        this.addLog(
          'warn',
          'Using Demo Firebase config. Real auth requests will require standard Firebase project keys.'
        );
      }

      // Always tear down any existing app so a new/changed config actually takes effect,
      // otherwise Firebase silently keeps using whichever config first initialized it.
      for (const existingApp of getApps()) {
        await deleteApp(existingApp);
      }
      this.app = initializeApp(currentConfig);

      this.auth = getAuth(this.app);
      this.isInitialized.set(true);
      this.addLog('success', 'Firebase App & Auth initialized.');

      // Listen for auth state changes
      if (this.authUnsubscribe) {
        this.authUnsubscribe();
      }

      this.authUnsubscribe = onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          this.currentUser.set(user);
          this.isMockUser.set(false);
          this.addLog('success', `Signed in as ${user.email || user.displayName || user.uid}`);
          try {
            const token = await user.getIdToken();
            this.rawIdToken.set(token);
          } catch {
            this.rawIdToken.set('');
          }
        } else {
          if (!this.isMockUser()) {
            this.currentUser.set(null);
            this.rawIdToken.set('');
            this.addLog('info', 'User signed out or no active session.');
          }
        }
      });

      // Start FirebaseUI
      setTimeout(() => {
        this.startFirebaseUI();
      }, 100);
    } catch (err: any) {
      this.addLog('error', `Firebase initialization error: ${err.message}`);
      this.isInitialized.set(false);
    }
  }

  protected startFirebaseUI(): void {
    if (!this.auth) {
      this.addLog('error', 'Auth not initialized.');
      return;
    }

    try {
      // Get or create AuthUI instance
      this.uiInstance =
        firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.auth);

      const uiConfig: firebaseui.auth.Config = {
        signInFlow: this.signInFlow(),
        signInSuccessUrl: '#',
        signInOptions: this.getSignInProviders(),
        callbacks: {
          signInSuccessWithAuthResult: (authResult, redirectUrl) => {
            this.addLog(
              'success',
              `FirebaseUI Sign-in success! User: ${
                authResult.user?.email || authResult.user?.uid
              }`
            );
            this.currentUser.set(authResult.user);
            return false; // Don't redirect automatically
          },
          signInFailure: (error) => {
            if (error.code === 'auth/api-key-not-valid' || error.message?.includes('api-key-not-valid')) {
              this.uiStatusMessage.set(
                '⚠️ Demo Key Detected: Real sign-in requires a valid Firebase API Key in the "Firebase Config" tab.'
              );
              this.addLog(
                'warn',
                'Firebase Auth error: Demo API key cannot perform real authentication. Enter valid Firebase credentials in "Firebase Config" tab or test using "Simulator Mode".'
              );
            } else {
              this.addLog('error', `FirebaseUI sign-in failure: ${error.message}`);
            }
            return Promise.resolve();
          },
          uiShown: () => {
            this.uiStatusMessage.set('FirebaseUI widget is active and rendered.');
            this.addLog('info', 'FirebaseUI widget rendered on screen.');
          },
        },
      };

      if (this.authContainerRef?.nativeElement) {
        this.uiInstance.start(this.authContainerRef.nativeElement, uiConfig);
        this.addLog('info', 'Started FirebaseUI widget.');
      } else {
        this.addLog('warn', 'Container element for FirebaseUI not found in DOM.');
      }
    } catch (err: any) {
      this.addLog('error', `FirebaseUI start error: ${err.message}`);
    }
  }

  protected getSignInProviders(): any[] {
    const providers: any[] = [];

    if (this.enableEmail()) {
      providers.push({
        provider: EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: this.requireDisplayName(),
      });
    }

    if (this.enableGoogle()) {
      providers.push(GoogleAuthProvider.PROVIDER_ID);
    }

    if (this.enablePhone()) {
      providers.push(PhoneAuthProvider.PROVIDER_ID);
    }

    if (this.enableAnonymous()) {
      providers.push('anonymous');
    }

    if (this.enableGithub()) {
      providers.push(GithubAuthProvider.PROVIDER_ID);
    }

    // Fallback if none checked
    if (providers.length === 0) {
      providers.push(EmailAuthProvider.PROVIDER_ID);
    }

    return providers;
  }

  protected restartUIWidget(): void {
    this.addLog('info', 'Re-rendering FirebaseUI widget with current options...');
    if (this.uiInstance) {
      this.uiInstance.reset();
    }
    this.startFirebaseUI();
  }

  private cleanupUI(): void {
    if (this.uiInstance) {
      try {
        this.uiInstance.reset();
      } catch {}
    }
  }

  protected handleSignOut(): void {
    if (this.auth) {
      signOut(this.auth)
        .then(() => {
          this.currentUser.set(null);
          this.isMockUser.set(false);
          this.mockUser.set(null);
          this.rawIdToken.set('');
          this.addLog('info', 'Signed out successfully.');
          this.restartUIWidget();
        })
        .catch((err) => {
          this.addLog('error', `Sign out error: ${err.message}`);
        });
    } else {
      this.currentUser.set(null);
      this.isMockUser.set(false);
      this.mockUser.set(null);
    }
  }

  // Demo / Mock User helper for testing UI state without live Firebase backend
  protected setMockSignedInUser(provider: 'google' | 'email' | 'github'): void {
    const mockData = {
      uid: 'mock-user-id-' + Math.floor(Math.random() * 10000),
      displayName: provider === 'google' ? 'Alex Rivera' : provider === 'github' ? 'Dev User' : 'Jane Doe',
      email: `${provider}.user@example.com`,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
      providerId: provider === 'google' ? 'google.com' : provider === 'github' ? 'github.com' : 'password',
      emailVerified: true,
    };

    this.isMockUser.set(true);
    this.mockUser.set(mockData);
    this.rawIdToken.set(
      'eyJhbGciOiJSUzI1NiIsImtpZCI6ImRlbW8ifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcG9jLXdlYi1hcHAtZGVtbyIsImF1ZCI6InBvYy13ZWItYXBwLWRlbW8iLCJhdXRoX3RpbWUiOjE3MTY4ODg4ODgsInVzZXJfaWQiOiJtb2NrLXVzZXItMTIzNCIsInN1YiI6Im1vY2stdXNlci0xMjM0IiwiZW1haWwiOiJkZW1vLnVzZXJAZXhhbXBsZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0.demoSignature'
    );
    this.addLog('success', `Simulated sign-in as Mock ${provider.toUpperCase()} user.`);
    this.activeTab.set('user');
  }

  protected addLog(type: 'info' | 'success' | 'warn' | 'error', message: string): void {
    const newLog: UIEventLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    this.eventLogs.update((logs: UIEventLog[]) => [newLog, ...logs.slice(0, 49)]);
  }

  protected clearLogs(): void {
    this.eventLogs.set([]);
  }

  protected copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
    this.addLog('info', 'Copied text to clipboard!');
  }
}
