import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LanguageService } from '../../../i18n/language.service';
import { WORKSHOP_COURSES, getWorkshopCourseById } from '../workshop-courses';
import { CourseApplicationService } from '../course-application.service';
import { WorkshopApplicationsService } from '../workshop-applications.service';
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
  private readonly applicationsApi = inject(WorkshopApplicationsService);

  protected readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.t;
  protected readonly courses = WORKSHOP_COURSES;
  protected readonly submitting = signal(false);
  protected readonly submitError = signal(false);

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

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitError.set(false);
    this.submitting.set(true);

    try {
      const application = await this.applicationsApi.create(this.form.getRawValue());
      this.applicationService.submitApplication({ id: application.id, ...this.form.getRawValue() });
      this.router.navigate(['/bakery/workshop/checkout']);
    } catch {
      this.submitError.set(true);
    } finally {
      this.submitting.set(false);
    }
  }
}
