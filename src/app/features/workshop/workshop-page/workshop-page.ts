import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

import { LanguageService } from '../../../i18n/language.service';
import { WORKSHOP_COURSES } from '../workshop-courses';
import { formatSessionDate } from '../../../shared/format-date';
import { TopBar } from '../../../shared/top-bar/top-bar';

@Component({
  selector: 'app-workshop-page',
  imports: [DecimalPipe, TopBar],
  templateUrl: './workshop-page.html',
  styleUrl: './workshop-page.scss',
})
export class WorkshopPage {
  private readonly router = inject(Router);

  protected readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.t;
  protected readonly courses = WORKSHOP_COURSES;

  protected selectCourse(courseId: string): void {
    this.router.navigate(['/bakery/workshop/apply'], { queryParams: { courseId } });
  }

  protected formatDate(iso: string): string {
    return formatSessionDate(iso, this.languageService.language());
  }
}
