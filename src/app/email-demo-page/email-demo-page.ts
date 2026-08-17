import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { EmailTestService } from './email-test.service';

@Component({
  selector: 'app-email-demo-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './email-demo-page.html',
  styleUrl: './email-demo-page.scss',
})
export class EmailDemoPage {
  private readonly emailTest = inject(EmailTestService);

  protected readonly to = signal('');
  protected readonly subject = signal('Homie Bakery — test email');
  protected readonly body = signal(
    "This is a test email from the Homie Bakery workshop backend's email-sending test page.",
  );

  protected readonly sending = signal(false);
  protected readonly statusMessage = signal('');
  protected readonly errorMessage = signal('');

  protected async send(): Promise<void> {
    if (!this.to()) {
      return;
    }

    this.sending.set(true);
    this.statusMessage.set('');
    this.errorMessage.set('');

    try {
      await this.emailTest.sendTestEmail({
        to: this.to(),
        subject: this.subject(),
        body: this.body(),
      });
      this.statusMessage.set(`Email sent to ${this.to()}.`);
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Failed to send email.');
    } finally {
      this.sending.set(false);
    }
  }
}
