import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LanguageService } from '../../../i18n/language.service';
import { CourseApplicationService } from '../course-application.service';
import { getWorkshopCourseById } from '../workshop-courses';
import { WorkshopApplicationsService, PaymentMethod } from '../workshop-applications.service';
import { TopBar } from '../../../shared/top-bar/top-bar';

const MAX_SLIP_BYTES = 8 * 1024 * 1024;

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1] ?? '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

@Component({
  selector: 'app-payment-page',
  imports: [RouterLink, DecimalPipe, ReactiveFormsModule, TopBar],
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.scss',
})
export class PaymentPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly applicationService = inject(CourseApplicationService);
  private readonly applicationsApi = inject(WorkshopApplicationsService);

  protected readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.t;
  protected readonly draft = this.applicationService.draft;
  protected readonly reference = this.applicationService.reference;
  protected readonly processing = signal(false);
  protected readonly submitError = signal(false);
  protected readonly slipErrorType = signal<'missing' | 'tooLarge' | null>(null);
  protected readonly submittedMethod = signal<PaymentMethod | null>(null);

  private slipFile: File | null = null;

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

  protected selectMethod(method: PaymentMethod): void {
    this.form.controls.method.setValue(method);
  }

  protected onSlipSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (file && file.size > MAX_SLIP_BYTES) {
      this.slipFile = null;
      input.value = '';
      this.slipErrorType.set('tooLarge');
      return;
    }

    this.slipFile = file;
    this.slipErrorType.set(null);
  }

  protected async pay(): Promise<void> {
    const method = this.form.controls.method.value;

    if (method === 'card') {
      const { cardholderName, cardNumber, expiry, cvv } = this.form.controls;
      if (!cardholderName.value || !cardNumber.value || !expiry.value || !cvv.value) {
        this.form.markAllAsTouched();
        return;
      }
    } else if (!this.slipFile) {
      this.slipErrorType.set('missing');
      return;
    }

    const draft = this.draft();
    const course = this.course();
    if (!draft || !course) {
      return;
    }

    this.submitError.set(false);
    this.slipErrorType.set(null);
    this.processing.set(true);

    const reference = this.applicationService.generateReference();

    try {
      if (method === 'card') {
        await this.applicationsApi.completePayment(draft.id, {
          paymentMethod: method,
          totalThb: this.total(),
          reference,
        });
      } else {
        const slipBase64 = await readFileAsBase64(this.slipFile!);
        await this.applicationsApi.uploadSlip(draft.id, {
          paymentMethod: method,
          totalThb: this.total(),
          reference,
          slipBase64,
          slipMimeType: this.slipFile!.type,
        });
      }
      this.submittedMethod.set(method);
      this.applicationService.confirmPayment(reference);
    } catch {
      this.submitError.set(true);
    } finally {
      this.processing.set(false);
    }
  }
}
