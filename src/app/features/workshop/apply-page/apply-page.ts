import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LanguageService } from '../../../i18n/language.service';
import { WORKSHOP_COURSES, getWorkshopCourseById } from '../workshop-courses';
import { CourseApplicationService } from '../course-application.service';
import { TopBar } from '../../../shared/top-bar/top-bar';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\-\s]{7,}$/;

@Component({
  selector: 'app-apply-page',
  imports: [ReactiveFormsModule, TopBar],
  templateUrl: './apply-page.html',
  styleUrl: './apply-page.scss',
})
export class ApplyPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly applicationService = inject(CourseApplicationService);

  protected readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.t;
  protected readonly courses = WORKSHOP_COURSES;

  protected readonly form = this.formBuilder.nonNullable.group({
    courseId: [this.preselectedCourseId(), Validators.required],
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    phone: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
    preferredDate: ['', Validators.required],
    participants: [2, [Validators.required, Validators.min(1), Validators.max(8)]],
    notes: [''],
  });

  private preselectedCourseId(): string {
    const courseId = this.route.snapshot.queryParamMap.get('courseId') ?? '';
    return getWorkshopCourseById(courseId) ? courseId : '';
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
