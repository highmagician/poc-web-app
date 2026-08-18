import { Injectable, computed, inject, signal } from '@angular/core';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth,
  GoogleAuthProvider,
  User,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { environment } from '../../environments/environment.dev';
import { WorkshopApplicationsService } from '../features/workshop/workshop-applications.service';

const ADMIN_AUTH_APP_NAME = 'workshop-admin-auth';

function getAdminAuthApp(): FirebaseApp {
  return (
    getApps().find((app) => app.name === ADMIN_AUTH_APP_NAME) ??
    initializeApp(environment.firebaseConfig, ADMIN_AUTH_APP_NAME)
  );
}

export class NotAllowedError extends Error {}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth: Auth = getAuth(getAdminAuthApp());
  private readonly applicationsApi = inject(WorkshopApplicationsService);
  private readonly readyPromise: Promise<void>;

  readonly currentUser = signal<User | null>(null);
  readonly authReady = signal(false);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    this.readyPromise = new Promise((resolve) => {
      onAuthStateChanged(this.auth, async (user) => {
        if (user && !(await this.isAdmin(user))) {
          await signOut(this.auth);
          this.currentUser.set(null);
        } else {
          this.currentUser.set(user);
        }
        this.authReady.set(true);
        resolve();
      });
    });
  }

  waitUntilReady(): Promise<void> {
    return this.readyPromise;
  }

  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const result = await signInWithPopup(this.auth, provider);

    if (!(await this.isAdmin(result.user))) {
      await signOut(this.auth);
      throw new NotAllowedError('This Google account is not on the admin allowlist.');
    }
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  // Backend endpoints protected by requireAdminRole_ (Code.js) expect this token as proof of
  // the caller's admin session — see workshop-applications.service.ts.
  async getIdToken(): Promise<string> {
    const user = this.currentUser();
    if (!user) {
      throw new Error('Not signed in.');
    }
    return user.getIdToken();
  }

  // Source of truth is the "Admins" sheet in poc-apps-script, not a compiled-in list — this
  // round-trips to Code.js's checkRole endpoint on every sign-in check.
  private async isAdmin(user: User): Promise<boolean> {
    const idToken = await user.getIdToken();
    return !!(await this.applicationsApi.checkAdminRole(idToken));
  }
}
