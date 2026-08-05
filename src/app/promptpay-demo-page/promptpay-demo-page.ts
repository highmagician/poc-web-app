import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import generatePayload from 'promptpay-qr';
import { toDataURL } from 'qrcode';

import { PromptPayConfigService, isValidPromptPayId } from '../features/workshop/prompt-pay-config.service';
import {
  PROMPTPAY_HEADER_IMAGE_SRC,
  SHOP_LOGO_IMAGE_SRC,
  formatTargetAccount,
  loadImage,
  renderPromptPaySlip,
  type PromptPaySlipLabels,
} from '../features/workshop/promptpay-slip';

const SLIP_LABELS: PromptPaySlipLabels = {
  shopName: 'Homie Bakery',
  targetAccount: 'Target account',
  transferAmount: 'Transfer amount',
  noFixedAmount: 'No fixed amount — enter in your banking app',
  description: 'Description',
};

@Component({
  selector: 'app-promptpay-demo-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './promptpay-demo-page.html',
  styleUrl: './promptpay-demo-page.scss',
})
export class PromptPayDemoPage {
  private readonly promptPayConfig = inject(PromptPayConfigService);

  protected readonly promptPayId = signal(this.promptPayConfig.promptPayId());
  protected readonly amount = signal<number | null>(100);
  protected readonly description = signal('Bakery workshop deposit');

  protected readonly qrDataUrl = signal<string | null>(null);
  protected readonly qrError = signal<string | null>(null);

  protected readonly slipDataUrl = signal<string | null>(null);
  protected readonly slipError = signal<string | null>(null);

  private readonly logosReady = signal(false);
  private headerImage: HTMLImageElement | null = null;
  private shopLogoImage: HTMLImageElement | null = null;

  private qrRequestId = 0;
  private slipRequestId = 0;

  constructor() {
    Promise.all([loadImage(PROMPTPAY_HEADER_IMAGE_SRC), loadImage(SHOP_LOGO_IMAGE_SRC)])
      .then(([header, shop]) => {
        this.headerImage = header;
        this.shopLogoImage = shop;
        this.logosReady.set(true);
      })
      .catch(() => this.slipError.set("Couldn't load the PromptPay or shop logo images."));
  }

  private readonly generateQr = effect(() => {
    const promptPayId = this.promptPayId();
    const amount = this.amount();
    const requestId = ++this.qrRequestId;

    this.qrDataUrl.set(null);
    this.qrError.set(null);

    if (!isValidPromptPayId(promptPayId)) {
      this.qrError.set('Enter a valid 10, 13, or 15-digit PromptPay ID with no spaces or dashes.');
      return;
    }

    if (amount !== null && amount <= 0) {
      this.qrError.set('Amount must be greater than 0, or left blank for no fixed amount.');
      return;
    }

    const payload = generatePayload(promptPayId, amount ? { amount } : {});
    toDataURL(payload, { width: 260, margin: 1 })
      .then((dataUrl) => {
        if (requestId === this.qrRequestId) {
          this.qrDataUrl.set(dataUrl);
        }
      })
      .catch(() => {
        if (requestId === this.qrRequestId) {
          this.qrError.set("Couldn't generate the QR code.");
        }
      });
  });

  private readonly composeSlip = effect(() => {
    const qrDataUrl = this.qrDataUrl();
    const logosReady = this.logosReady();
    const targetAccount = formatTargetAccount(this.promptPayId());
    const amount = this.amount();
    const description = this.description();
    const requestId = ++this.slipRequestId;

    this.slipDataUrl.set(null);

    if (!qrDataUrl || !logosReady || !this.headerImage || !this.shopLogoImage) {
      return;
    }

    this.slipError.set(null);

    loadImage(qrDataUrl)
      .then((qrImage) => {
        if (requestId !== this.slipRequestId) {
          return;
        }
        const dataUrl = renderPromptPaySlip({
          qrImage,
          headerImage: this.headerImage!,
          shopLogoImage: this.shopLogoImage!,
          targetAccount,
          amount,
          description,
          labels: SLIP_LABELS,
        });
        this.slipDataUrl.set(dataUrl);
      })
      .catch(() => {
        if (requestId === this.slipRequestId) {
          this.slipError.set("Couldn't render the slip image.");
        }
      });
  });

  protected onPromptPayIdChange(value: string): void {
    this.promptPayId.set(value.trim());
  }

  protected onAmountChange(value: number | null): void {
    this.amount.set(value === null || Number.isNaN(value) ? null : value);
  }

  protected onDescriptionChange(value: string): void {
    this.description.set(value);
  }
}
