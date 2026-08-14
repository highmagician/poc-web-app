import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Messaging, getMessaging, getToken, onMessage } from 'firebase/messaging';

import { environment } from '../../environments/environment.dev';
import { FcmNotificationsService } from './fcm-notifications.service';

const FCM_APP_NAME = 'fcm-demo';
const FCM_SW_SCOPE = '/firebase-cloud-messaging-push-scope';
const NOTIFICATION_ICON = '/icons/icon-192x192.png';

@Component({
  selector: 'app-fcm-demo-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './fcm-demo-page.html',
  styleUrl: './fcm-demo-page.scss',
})
export class FcmDemoPage implements OnInit {
  private readonly fcm = inject(FcmNotificationsService);
  private messaging: Messaging | null = null;

  protected readonly token = signal('');
  protected readonly statusMessage = signal('');
  protected readonly errorMessage = signal('');
  protected readonly sendingNow = signal(false);
  protected readonly scheduling = signal(false);

  protected readonly title = signal('Test notification');
  protected readonly body = signal('Hello from the Homie Bakery admin test page');
  protected readonly link = signal('/bakery/workshop');
  protected readonly sendAt = signal('');

  ngOnInit(): void {
    void this.setupMessaging();
  }

  private async setupMessaging(): Promise<void> {
    if (!('serviceWorker' in navigator) || typeof Notification === 'undefined') {
      this.errorMessage.set('This browser does not support push notifications.');
      return;
    }

    try {
      const config = environment.firebaseConfig;
      const app: FirebaseApp = getApps().some((existing) => existing.name === FCM_APP_NAME)
        ? getApp(FCM_APP_NAME)
        : initializeApp(config, FCM_APP_NAME);

      const swUrl = `/firebase-messaging-sw.js?${new URLSearchParams({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId,
      })}`;
      const registration = await navigator.serviceWorker.register(swUrl, { scope: FCM_SW_SCOPE });

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        this.errorMessage.set('Notification permission was not granted.');
        return;
      }

      this.messaging = getMessaging(app);
      const token = await getToken(this.messaging, {
        vapidKey: config.vapidKey,
        serviceWorkerRegistration: registration,
      });
      this.token.set(token);
      this.statusMessage.set('Subscribed for push notifications on this browser.');

      onMessage(this.messaging, (payload) => {
        const data = payload.data ?? {};
        registration.showNotification(data['title'] || 'Homie Bakery', {
          body: data['body'] || '',
          icon: NOTIFICATION_ICON,
          data: { link: data['link'] || '/' },
        });
      });
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Failed to set up push notifications.');
    }
  }

  protected async sendNow(): Promise<void> {
    if (!this.token()) {
      return;
    }

    this.sendingNow.set(true);
    this.errorMessage.set('');
    try {
      await this.fcm.sendNow({
        token: this.token(),
        title: this.title(),
        body: this.body(),
        link: this.link(),
      });
      this.statusMessage.set('Notification sent.');
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Failed to send notification.');
    } finally {
      this.sendingNow.set(false);
    }
  }

  protected async schedule(): Promise<void> {
    if (!this.token() || !this.sendAt()) {
      return;
    }

    this.scheduling.set(true);
    this.errorMessage.set('');
    try {
      const result = await this.fcm.schedule({
        token: this.token(),
        title: this.title(),
        body: this.body(),
        link: this.link(),
        sendAt: new Date(this.sendAt()).toISOString(),
      });
      this.statusMessage.set(`Scheduled for ${new Date(result.sendAt).toLocaleString()}.`);
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Failed to schedule notification.');
    } finally {
      this.scheduling.set(false);
    }
  }
}
