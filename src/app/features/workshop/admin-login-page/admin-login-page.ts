import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService, NotAllowedError } from '../../../auth/auth.service';
import { LanguageService } from '../../../i18n/language.service';
import { TopBar } from '../../../shared/top-bar/top-bar';

@Component({
  selector: 'app-admin-login-page',
  imports: [TopBar],
  templateUrl: './admin-login-page.html',
  styleUrl: './admin-login-page.scss',
})
export class AdminLoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.t;
  protected readonly signingIn = signal(false);
  protected readonly signInError = signal(false);
  protected readonly notAllowedError = signal(false);

  protected async signInWithGoogle(): Promise<void> {
    this.signInError.set(false);
    this.notAllowedError.set(false);
    this.signingIn.set(true);

    try {
      await this.authService.signInWithGoogle();
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/bakery/workshop/admin';
      this.router.navigateByUrl(returnUrl);
    } catch (error) {
      if (error instanceof NotAllowedError) {
        this.notAllowedError.set(true);
      } else {
        this.signInError.set(true);
      }
    } finally {
      this.signingIn.set(false);
    }
  }
}
