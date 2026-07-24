import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../../i18n/language.service';
import { WorkshopApplicationsService, WorkshopApplication } from '../workshop-applications.service';
import { getWorkshopCourseById } from '../workshop-courses';
import { formatTimestamp } from '../../../shared/format-date';
import { TopBar } from '../../../shared/top-bar/top-bar';

@Component({
  selector: 'app-admin-page',
  imports: [RouterLink, DecimalPipe, TopBar],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss',
})
export class AdminPage {
  private readonly applicationsApi = inject(WorkshopApplicationsService);

  protected readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.t;
  protected readonly applications = signal<WorkshopApplication[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadError = signal(false);

  constructor() {
    this.refresh();
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
