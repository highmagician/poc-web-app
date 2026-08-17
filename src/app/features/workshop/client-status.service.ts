import { Injectable, inject, signal } from '@angular/core';

import { WorkshopApplication, WorkshopApplicationsService } from './workshop-applications.service';

@Injectable({ providedIn: 'root' })
export class ClientStatusService {
  private readonly applicationsApi = inject(WorkshopApplicationsService);

  private readonly _application = signal<WorkshopApplication | null>(null);
  readonly application = this._application.asReadonly();

  async login(token: string, email: string): Promise<void> {
    const application = await this.applicationsApi.checkStatus(token, email);
    this._application.set(application);
  }

  clear(): void {
    this._application.set(null);
  }
}
