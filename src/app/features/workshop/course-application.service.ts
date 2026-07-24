import { Injectable, signal } from '@angular/core';

export interface CourseApplicationDraft {
  id: string;
  courseId: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  participants: number;
  notes: string;
}

@Injectable({ providedIn: 'root' })
export class CourseApplicationService {
  private readonly _draft = signal<CourseApplicationDraft | null>(null);
  readonly draft = this._draft.asReadonly();

  private readonly _reference = signal<string | null>(null);
  readonly reference = this._reference.asReadonly();

  submitApplication(draft: CourseApplicationDraft): void {
    this._draft.set(draft);
    this._reference.set(null);
  }

  generateReference(): string {
    return `HB-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  confirmPayment(reference: string): void {
    this._reference.set(reference);
  }

  clear(): void {
    this._draft.set(null);
    this._reference.set(null);
  }
}
