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
  // URL scheme name (no "://"), e.g. 'scbeasy'. Used directly on iOS and inside the Android
  // intent. This is what actually opens the installed app.
  scheme: string;
  // Android package id — only used to build the Play Store fallback when the app isn't installed.
  // VERIFY each id in the app's Play Store URL: play.google.com/store/apps/details?id=<PACKAGE>
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
    { name: 'K PLUS', bankTh: 'กสิกรไทย', color: '#138f2d', scheme: 'kplus', androidPackage: 'com.kasikorn.retail.mbanking.wap' },
    { name: 'SCB EASY', bankTh: 'ไทยพาณิชย์', color: '#4e2a84', scheme: 'scbeasy', androidPackage: 'com.scb.phone' },
    { name: 'Krungthai NEXT', bankTh: 'กรุงไทย', color: '#00a4e4', scheme: 'ktbnext', androidPackage: 'ktbcs.netbank' },
    { name: 'KMA Krungsri', bankTh: 'กรุงศรี', color: '#c89000', scheme: 'kma', androidPackage: 'com.krungsri.kma' },
  ];

  constructor() {
    this.refresh();
  }

  protected openBankApp(app: BankApp): void {
    const userAgent = navigator.userAgent;
    const playStoreUrl = `https://play.google.com/store/apps/details?id=${app.androidPackage}`;

    if (/Android/i.test(userAgent)) {
      // Open the app via its URL scheme, routed through an Android intent so we can attach a
      // Play Store fallback for when the app isn't installed. The scheme (not just the package)
      // is required: a package-only intent has no resolvable activity, so Chrome would always
      // take the fallback even when the app IS installed.
      window.location.href =
        `intent://#Intent;scheme=${app.scheme};package=${app.androidPackage};` +
        `S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`;
      return;
    }

    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      // iOS can only use the URL scheme (no launch-by-package). Fall back to an App Store search
      // if nothing handles the scheme within a short window.
      const fallback = setTimeout(() => {
        window.location.href = `https://apps.apple.com/th/search?term=${encodeURIComponent(app.name)}`;
      }, 1500);
      // If the app opens, the page is backgrounded; cancel the store fallback on the way out.
      window.addEventListener('pagehide', () => clearTimeout(fallback), { once: true });
      window.location.href = `${app.scheme}://`;
      return;
    }

    // Desktop / other: no app to open — send to the store listing.
    window.location.href = playStoreUrl;
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
