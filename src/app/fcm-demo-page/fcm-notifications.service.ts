import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { WORKSHOP_API_URL } from '../features/workshop/workshop-api.config';

const TEXT_PLAIN_HEADERS = { 'Content-Type': 'text/plain' };

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

export interface SendNotificationInput {
  token: string;
  title: string;
  body: string;
  link: string;
}

export interface ScheduleNotificationInput extends SendNotificationInput {
  sendAt: string;
}

export interface ScheduledNotification {
  id: string;
  sendAt: string;
}

@Injectable({ providedIn: 'root' })
export class FcmNotificationsService {
  private readonly http = inject(HttpClient);

  async sendNow(data: SendNotificationInput): Promise<void> {
    await unwrap(
      firstValueFrom(
        this.http.post<ApiEnvelope>(
          WORKSHOP_API_URL,
          JSON.stringify({ action: 'sendNotification', data }),
          { headers: TEXT_PLAIN_HEADERS },
        ),
      ),
    );
  }

  async schedule(data: ScheduleNotificationInput): Promise<ScheduledNotification> {
    const response = await unwrap(
      firstValueFrom(
        this.http.post<ApiEnvelope & { scheduled: ScheduledNotification }>(
          WORKSHOP_API_URL,
          JSON.stringify({ action: 'scheduleNotification', data }),
          { headers: TEXT_PLAIN_HEADERS },
        ),
      ),
    );
    return response.scheduled;
  }
}
