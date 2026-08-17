import { Injectable, computed, signal } from '@angular/core';
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

const ADMIN_AUTH_APP_NAME = 'workshop-admin-auth';

function getAdminAuthApp(): FirebaseApp {
  return (
    getApps().find((app) => app.name === ADMIN_AUTH_APP_NAME) ??
    initializeApp(environment.firebaseConfig, ADMIN_AUTH_APP_NAME)
  );
}

function parseAllowedEmails(raw: string): string[] {
  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0 && !email.startsWith('__'));
}

const ALLOWED_EMAILS = parseAllowedEmails(environment.adminAllowedEmails);

// Exported so the client-facing check-status login can reject admin emails without needing to
// pull in the whole Firebase-backed AuthService just for this one string comparison.
export function isAdminAllowedEmail(email: string): boolean {
  return ALLOWED_EMAILS.includes(email.trim().toLowerCase());
}

export class NotAllowedError extends Error {}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth: Auth = getAuth(getAdminAuthApp());
  private readonly readyPromise: Promise<void>;

  readonly currentUser = signal<User | null>(null);
  readonly authReady = signal(false);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    this.readyPromise = new Promise((resolve) => {
      onAuthStateChanged(this.auth, async (user) => {
        if (user && !this.isEmailAllowed(user.email)) {
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

    if (!this.isEmailAllowed(result.user.email)) {
      await signOut(this.auth);
      throw new NotAllowedError('This Google account is not on the admin allowlist.');
    }
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  private isEmailAllowed(email: string | null): boolean {
    return !!email && isAdminAllowedEmail(email);
  }
}
