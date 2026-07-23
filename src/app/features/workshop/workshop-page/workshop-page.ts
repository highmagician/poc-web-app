import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LanguageService } from '../../../i18n/language.service';
import { Language } from '../../../i18n/translations';
import { WORKSHOP_COURSES } from '../workshop-courses';
import { CourseApplicationService } from '../course-application.service';
import { formatSessionDate } from '../../../shared/format-date';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\-\s]{7,}$/;

@Component({
  selector: 'app-workshop-page',
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './workshop-page.html',
  styleUrl: './workshop-page.scss',
})
export class WorkshopPage {
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly applicationService = inject(CourseApplicationService);

  protected readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.t;
  protected readonly courses = WORKSHOP_COURSES;

  protected readonly form = this.formBuilder.nonNullable.group({
    courseId: ['', Validators.required],
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    phone: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
    preferredDate: ['', Validators.required],
    participants: [2, [Validators.required, Validators.min(1), Validators.max(8)]],
    notes: [''],
  });

  protected setLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }

  protected selectCourse(courseId: string): void {
    this.form.controls.courseId.setValue(courseId);
  }

  protected formatDate(iso: string): string {
    return formatSessionDate(iso, this.languageService.language());
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.applicationService.submitApplication(this.form.getRawValue());
    this.router.navigate(['/bakery/workshop/checkout']);
  }
}
