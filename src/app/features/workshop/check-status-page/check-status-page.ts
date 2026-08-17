import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { LanguageService } from '../../../i18n/language.service';
import { ClientStatusService } from '../client-status.service';
import { getWorkshopCourseById } from '../workshop-courses';
import { formatSessionDate } from '../../../shared/format-date';
import { TopBar } from '../../../shared/top-bar/top-bar';

@Component({
  selector: 'app-check-status-page',
  imports: [DecimalPipe, RouterLink, TopBar],
  templateUrl: './check-status-page.html',
  styleUrl: './check-status-page.scss',
})
export class CheckStatusPage {
  private readonly clientStatusService = inject(ClientStatusService);
  private readonly router = inject(Router);

  protected readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.t;
  protected readonly application = this.clientStatusService.application;

  protected courseName(courseId: string): string {
    const course = getWorkshopCourseById(courseId);
    if (!course) {
      return courseId;
    }
    return this.languageService.language() === 'th' ? course.name.th : course.name.en;
  }

  protected formatDate(iso: string): string {
    return formatSessionDate(iso, this.languageService.language());
  }

  protected checkAnother(): void {
    this.clientStatusService.clear();
    this.router.navigateByUrl('/bakery/workshop/check-status/login');
  }
}
