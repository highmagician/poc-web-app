import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../../i18n/language.service';
import { Language } from '../../../i18n/translations';
import { CourseApplicationService } from '../course-application.service';
import { getWorkshopCourseById } from '../workshop-courses';
import { formatSessionDate } from '../../../shared/format-date';

@Component({
  selector: 'app-checkout-page',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.scss',
})
export class CheckoutPage {
  private readonly applicationService = inject(CourseApplicationService);

  protected readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.t;
  protected readonly draft = this.applicationService.draft;

  protected readonly course = computed(() => {
    const draft = this.draft();
    return draft ? getWorkshopCourseById(draft.courseId) : undefined;
  });

  protected readonly total = computed(() => {
    const course = this.course();
    const draft = this.draft();
    return course && draft ? course.priceThb * draft.participants : 0;
  });

  protected formatDate(iso: string): string {
    return formatSessionDate(iso, this.languageService.language());
  }

  protected setLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }
}
