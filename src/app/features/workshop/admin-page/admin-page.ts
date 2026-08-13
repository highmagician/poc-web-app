import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../../../auth/auth.service';
import { LanguageService } from '../../../i18n/language.service';
import { WorkshopApplicationsService, WorkshopApplication } from '../workshop-applications.service';
import { getWorkshopCourseById } from '../workshop-courses';
import { PromptPayConfigService, isValidPromptPayId } from '../prompt-pay-config.service';
import { formatTimestamp } from '../../../shared/format-date';
import { TopBar } from '../../../shared/top-bar/top-bar';

@Component({
  selector: 'app-admin-page',
  imports: [RouterLink, DecimalPipe, ReactiveFormsModule, TopBar],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss',
})
export class AdminPage {
  private readonly applicationsApi = inject(WorkshopApplicationsService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly promptPayConfig = inject(PromptPayConfigService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.t;
  protected readonly applications = signal<WorkshopApplication[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadError = signal(false);
  protected readonly promptPaySaved = signal(false);
  protected readonly promptPayInvalid = signal(false);

  protected readonly promptPayForm = this.formBuilder.nonNullable.group({
    promptPayId: [this.promptPayConfig.promptPayId()],
  });

  protected readonly currentUser = this.authService.currentUser;

  constructor() {
    this.refresh();
  }

  protected async signOut(): Promise<void> {
    await this.authService.signOut();
    this.router.navigateByUrl('/bakery/workshop/admin/login');
  }

  protected savePromptPaySettings(): void {
    this.promptPaySaved.set(false);
    const value = this.promptPayForm.controls.promptPayId.value.trim();

    if (!isValidPromptPayId(value)) {
      this.promptPayInvalid.set(true);
      return;
    }

    this.promptPayConfig.setPromptPayId(value);
    this.promptPayInvalid.set(false);
    this.promptPaySaved.set(true);
  }

  protected async approveOrder(id: string): Promise<void> {
    try {
      const updated = await this.applicationsApi.approve(id);
      this.applications.update((applications) =>
        applications.map((application) => (application.id === id ? updated : application)),
      );
    } catch {
      this.loadError.set(true);
    }
  }

  protected async rejectOrder(id: string): Promise<void> {
    if (!confirm(this.t().admin.rejectConfirm)) {
      return;
    }

    try {
      const updated = await this.applicationsApi.reject(id);
      this.applications.update((applications) =>
        applications.map((application) => (application.id === id ? updated : application)),
      );
    } catch {
      this.loadError.set(true);
    }
  }

  protected formatTimestamp(iso: string): string {
    return formatTimestamp(iso, this.languageService.language());
  }

  protected courseName(courseId: string): string {
    const course = getWorkshopCourseById(courseId);
    if (!course) {
      return courseId;
    }
    return this.languageService.language() === 'th' ? course.name.th : course.name.en;
  }

  protected async cancelOrder(id: string): Promise<void> {
    if (!confirm(this.t().admin.cancelConfirm)) {
      return;
    }

    try {
      await this.applicationsApi.remove(id);
      this.applications.update((applications) => applications.filter((application) => application.id !== id));
    } catch {
      this.loadError.set(true);
    }
  }

  private async refresh(): Promise<void> {
    this.loading.set(true);
    this.loadError.set(false);

    try {
      const applications = await this.applicationsApi.list();
      applications.sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso));
      this.applications.set(applications);
    } catch {
      this.loadError.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
