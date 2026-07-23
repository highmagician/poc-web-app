import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LanguageService } from '../../../i18n/language.service';
import { Language } from '../../../i18n/translations';
import { CourseApplicationService } from '../course-application.service';
import { getWorkshopCourseById } from '../workshop-courses';
import { WorkshopOrdersService } from '../workshop-orders.service';
import { PaymentMethod } from '../workshop-order';

@Component({
  selector: 'app-payment-page',
  imports: [RouterLink, DecimalPipe, ReactiveFormsModule],
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.scss',
})
export class PaymentPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly applicationService = inject(CourseApplicationService);
  private readonly ordersService = inject(WorkshopOrdersService);

  protected readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.t;
  protected readonly draft = this.applicationService.draft;
  protected readonly reference = this.applicationService.reference;

  protected readonly course = computed(() => {
    const draft = this.draft();
    return draft ? getWorkshopCourseById(draft.courseId) : undefined;
  });

  protected readonly total = computed(() => {
    const course = this.course();
    const draft = this.draft();
    return course && draft ? course.priceThb * draft.participants : 0;
  });

  protected readonly form = this.formBuilder.nonNullable.group({
    method: ['card' as PaymentMethod, Validators.required],
    cardholderName: [''],
    cardNumber: [''],
    expiry: [''],
    cvv: [''],
  });

  protected setLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }

  protected selectMethod(method: PaymentMethod): void {
    this.form.controls.method.setValue(method);
  }

  protected pay(): void {
    const method = this.form.controls.method.value;

    if (method === 'card') {
      const { cardholderName, cardNumber, expiry, cvv } = this.form.controls;
      if (!cardholderName.value || !cardNumber.value || !expiry.value || !cvv.value) {
        this.form.markAllAsTouched();
        return;
      }
    }

    const draft = this.draft();
    const course = this.course();
    if (!draft || !course) {
      return;
    }

    const reference = this.applicationService.confirmPayment();

    this.ordersService.addOrder({
      reference,
      createdAtIso: new Date().toISOString(),
      courseId: course.id,
      courseNameEn: course.name.en,
      courseNameTh: course.name.th,
      fullName: draft.fullName,
      email: draft.email,
      phone: draft.phone,
      preferredDate: draft.preferredDate,
      participants: draft.participants,
      notes: draft.notes,
      paymentMethod: method,
      totalThb: this.total(),
    });
  }
}
