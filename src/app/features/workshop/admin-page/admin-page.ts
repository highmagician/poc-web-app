import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../../i18n/language.service';
import { Language } from '../../../i18n/translations';
import { WorkshopOrdersService } from '../workshop-orders.service';
import { formatTimestamp } from '../../../shared/format-date';

@Component({
  selector: 'app-admin-page',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss',
})
export class AdminPage {
  private readonly ordersService = inject(WorkshopOrdersService);

  protected readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.t;
  protected readonly orders = this.ordersService.orders;

  protected setLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }

  protected formatTimestamp(iso: string): string {
    return formatTimestamp(iso, this.languageService.language());
  }

  protected courseName(order: { courseNameEn: string; courseNameTh: string }): string {
    return this.languageService.language() === 'th' ? order.courseNameTh : order.courseNameEn;
  }
}
