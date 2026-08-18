import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LanguageService } from '../../../i18n/language.service';
import { ClientStatusService } from '../client-status.service';
import { WorkshopApplicationsService } from '../workshop-applications.service';
import { TopBar } from '../../../shared/top-bar/top-bar';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-check-status-login-page',
  imports: [ReactiveFormsModule, RouterLink, TopBar],
  templateUrl: './check-status-login-page.html',
  styleUrl: './check-status-login-page.scss',
})
export class CheckStatusLoginPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly clientStatusService = inject(ClientStatusService);
  private readonly applicationsApi = inject(WorkshopApplicationsService);

  protected readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.t;
  protected readonly checking = signal(false);
  protected readonly notFoundError = signal(false);
  protected readonly adminEmailError = signal(false);

  protected readonly form = this.formBuilder.nonNullable.group({
    email: [this.route.snapshot.queryParamMap.get('email') ?? '', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    token: [this.route.snapshot.queryParamMap.get('token') ?? '', Validators.required],
  });

  constructor() {
    if (this.form.valid) {
      this.submit();
    }
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.notFoundError.set(false);
    this.adminEmailError.set(false);

    const { email, token } = this.form.getRawValue();

    if (await this.applicationsApi.checkAdminEmail(email)) {
      this.adminEmailError.set(true);
      return;
    }

    this.checking.set(true);

    try {
      await this.clientStatusService.login(token.trim(), email.trim());
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/bakery/workshop/check-status';
      this.router.navigateByUrl(returnUrl);
    } catch {
      this.notFoundError.set(true);
    } finally {
      this.checking.set(false);
    }
  }
}
