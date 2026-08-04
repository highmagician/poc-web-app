import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { WORKSHOP_API_URL } from './workshop-api.config';

export type ApplicationStatus = 'pending' | 'review' | 'paid';
export type PaymentMethod = 'card' | 'promptpay' | 'transfer';

export interface WorkshopApplication {
  id: string;
  createdAtIso: string;
  updatedAtIso: string;
  status: ApplicationStatus;
  courseId: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  participants: number;
  notes: string;
  paymentMethod: PaymentMethod | '';
  totalThb: number | '';
  reference: string;
  slipUrl: string;
}

export interface CreateApplicationInput {
  courseId: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  participants: number;
  notes: string;
}

export interface CompletePaymentInput {
  paymentMethod: PaymentMethod;
  totalThb: number;
  reference: string;
}

export interface UploadSlipInput {
  paymentMethod: PaymentMethod;
  totalThb: number;
  reference: string;
  slipBase64: string;
  slipMimeType: string;
}

// A text/plain content type keeps the browser from sending a CORS preflight (OPTIONS) request,
// which the Apps Script web app has no handler for.
const TEXT_PLAIN_HEADERS = { 'Content-Type': 'text/plain' };

// Apps Script Web Apps always reply over HTTP with status 200, so the backend puts an
// application-level status in the JSON body instead — this reads that field and throws for
// anything that isn't a 2xx, so callers can rely on ordinary try/catch.
interface ApiEnvelope {
  status: number;
  error?: string;
}

async function unwrap<T extends ApiEnvelope>(request: Promise<T>): Promise<T> {
  const response = await request;
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.error ?? `Request failed with status ${response.status}`);
  }
  return response;
}

@Injectable({ providedIn: 'root' })
export class WorkshopApplicationsService {
  private readonly http = inject(HttpClient);

  async create(data: CreateApplicationInput): Promise<WorkshopApplication> {
    const response = await unwrap(
      firstValueFrom(
        this.http.post<ApiEnvelope & { application: WorkshopApplication }>(
          WORKSHOP_API_URL,
          JSON.stringify({ action: 'create', data }),
          { headers: TEXT_PLAIN_HEADERS },
        ),
      ),
    );
    return response.application;
  }

  async list(): Promise<WorkshopApplication[]> {
    const response = await unwrap(
      firstValueFrom(this.http.get<ApiEnvelope & { applications: WorkshopApplication[] }>(WORKSHOP_API_URL)),
    );
    return response.applications;
  }

  async completePayment(id: string, data: CompletePaymentInput): Promise<WorkshopApplication> {
    const response = await unwrap(
      firstValueFrom(
        this.http.post<ApiEnvelope & { application: WorkshopApplication }>(
          WORKSHOP_API_URL,
          JSON.stringify({ action: 'update', id, data: { status: 'paid', ...data } }),
          { headers: TEXT_PLAIN_HEADERS },
        ),
      ),
    );
    return response.application;
  }

  async remove(id: string): Promise<void> {
    await unwrap(
      firstValueFrom(
        this.http.post<ApiEnvelope & { id: string }>(
          WORKSHOP_API_URL,
          JSON.stringify({ action: 'delete', id }),
          { headers: TEXT_PLAIN_HEADERS },
        ),
      ),
    );
  }

  async uploadSlip(id: string, data: UploadSlipInput): Promise<WorkshopApplication> {
    const response = await unwrap(
      firstValueFrom(
        this.http.post<ApiEnvelope & { application: WorkshopApplication }>(
          WORKSHOP_API_URL,
          JSON.stringify({ action: 'uploadSlip', id, data }),
          { headers: TEXT_PLAIN_HEADERS },
        ),
      ),
    );
    return response.application;
  }

  async approve(id: string): Promise<WorkshopApplication> {
    const response = await unwrap(
      firstValueFrom(
        this.http.post<ApiEnvelope & { application: WorkshopApplication }>(
          WORKSHOP_API_URL,
          JSON.stringify({ action: 'update', id, data: { status: 'paid' } }),
          { headers: TEXT_PLAIN_HEADERS },
        ),
      ),
    );
    return response.application;
  }

  async reject(id: string): Promise<WorkshopApplication> {
    const response = await unwrap(
      firstValueFrom(
        this.http.post<ApiEnvelope & { application: WorkshopApplication }>(
          WORKSHOP_API_URL,
          JSON.stringify({
            action: 'update',
            id,
            data: { status: 'pending', slipFileId: '', slipUrl: '' },
          }),
          { headers: TEXT_PLAIN_HEADERS },
        ),
      ),
    );
    return response.application;
  }
}
