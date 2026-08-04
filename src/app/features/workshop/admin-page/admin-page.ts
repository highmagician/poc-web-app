import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../../i18n/language.service';
import { WorkshopApplicationsService, WorkshopApplication } from '../workshop-applications.service';
import { getWorkshopCourseById } from '../workshop-courses';
import { formatTimestamp } from '../../../shared/format-date';
import { TopBar } from '../../../shared/top-bar/top-bar';

interface BankApp {
  name: string;
  bankTh: string;
  color: string;
  // iOS URL scheme (opens the app if installed). These already open the app on-device.
  iosScheme: string;
  // Android package id. Launching by package opens the app like tapping its icon, which
  // avoids the deep-link handler that shows the "unsupported app version" screen.
  // VERIFY each id on a real device — a wrong id silently falls back to the store.
  // Find it in the app's Play Store URL: play.google.com/store/apps/details?id=<PACKAGE>
  androidPackage: string;
}

@Component({
  selector: 'app-admin-page',
  imports: [RouterLink, DecimalPipe, TopBar],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss',
})
export class AdminPage {
  private readonly applicationsApi = inject(WorkshopApplicationsService);

  protected readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.t;
  protected readonly applications = signal<WorkshopApplication[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadError = signal(false);

  // androidPackage values are best-effort and MUST be verified per app on a real device.
  protected readonly bankApps: BankApp[] = [
    { name: 'K PLUS', bankTh: 'กสิกรไทย', color: '#138f2d', iosScheme: 'kplus://', androidPackage: 'com.kasikorn.retail.mbanking.wap' },
    { name: 'SCB EASY', bankTh: 'ไทยพาณิชย์', color: '#4e2a84', iosScheme: 'scbeasy://', androidPackage: 'com.scb.phone' },
    { name: 'Krungthai NEXT', bankTh: 'กรุงไทย', color: '#00a4e4', iosScheme: 'ktbnext://', androidPackage: 'ktbcs.netbank' },
    { name: 'KMA Krungsri', bankTh: 'กรุงศรี', color: '#c89000', iosScheme: 'kma://', androidPackage: 'com.krungsri.kma' },
  ];

  constructor() {
    this.refresh();
  }

  protected openBankApp(app: BankApp): void {
    const userAgent = navigator.userAgent;

    if (/Android/i.test(userAgent)) {
      // Launch by package (like tapping the app icon) instead of the deep-link scheme, so we
      // bypass the deep-link handler that shows the "unsupported version" screen. If the app
      // isn't installed, Chrome follows browser_fallback_url to the Play Store.
      const playStoreUrl = `https://play.google.com/store/apps/details?id=${app.androidPackage}`;
      window.location.href =
        `intent://#Intent;package=${app.androidPackage};S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`;
      return;
    }

    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      // iOS can't launch an app by bundle id from the browser — only the URL scheme is available.
      // If the app itself blocks/deprecates scheme launches, that message can't be suppressed here.
      // Fall back to an App Store search if nothing handles the scheme.
      const fallback = setTimeout(() => {
        window.location.href = `https://apps.apple.com/th/search?term=${encodeURIComponent(app.name)}`;
      }, 1500);
      // If the app opens, the page is backgrounded; cancel the store fallback on the way out.
      window.addEventListener('pagehide', () => clearTimeout(fallback), { once: true });
      window.location.href = app.iosScheme;
      return;
    }

    // Desktop / other: no app to open — send to the store listing.
    window.location.href = `https://play.google.com/store/apps/details?id=${app.androidPackage}`;
  }

  protected formatTimestamp(iso: string): string {
    return formatTimestamp(iso, this.languageService.language());
  }

  protected courseName(courseId: string): string {
    const course = getWorkshopCourseById(courseId);
    if (!course) {
      return courseId;
    }
    return this.languageService.language() === 'th' ? course.name.th : course.name.en;
  }

  protected async cancelOrder(id: string): Promise<void> {
    if (!confirm(this.t().admin.cancelConfirm)) {
      return;
    }

    try {
      await this.applicationsApi.remove(id);
      this.applications.update((applications) => applications.filter((application) => application.id !== id));
    } catch {
      this.loadError.set(true);
    }
  }

  private async refresh(): Promise<void> {
    this.loading.set(true);
    this.loadError.set(false);

    try {
      const applications = await this.applicationsApi.list();
      applications.sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso));
      this.applications.set(applications);
    } catch {
      this.loadError.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
