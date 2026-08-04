import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import generatePayload from 'promptpay-qr';
import { toDataURL } from 'qrcode';

import { PromptPayConfigService, isValidPromptPayId } from '../features/workshop/prompt-pay-config.service';

const CANVAS_WIDTH = 480;
const PADDING = 24;
const HEADER_IMAGE_SRC = '/images/promptpay-qr-header.png';
const SHOP_LOGO_SRC = '/images/shop-logo.png';
const SHOP_NAME = 'Homie Bakery';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

// PromptPay IDs are grouped the way Thai banking apps display them: phone numbers as
// 3-3-4 digits, citizen/tax IDs as 1-4-5-2-1, e-Wallet IDs just in 3s.
function formatTargetAccount(id: string): string {
  if (id.length === 10) {
    return `${id.slice(0, 3)}-${id.slice(3, 6)}-${id.slice(6)}`;
  }
  if (id.length === 13) {
    return `${id.slice(0, 1)}-${id.slice(1, 5)}-${id.slice(5, 10)}-${id.slice(10, 12)}-${id.slice(12)}`;
  }
  return id.replace(/(\d{3})(?=\d)/g, '$1-');
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && ctx.measureText(candidate).width > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) {
    lines.push(current);
  }

  if (lines.length <= maxLines) {
    return lines;
  }

  const truncated = lines.slice(0, maxLines);
  let lastLine = truncated[maxLines - 1];
  while (lastLine.length > 1 && ctx.measureText(`${lastLine}…`).width > maxWidth) {
    lastLine = lastLine.slice(0, -1);
  }
  truncated[maxLines - 1] = `${lastLine}…`;
  return truncated;
}

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

interface SlipInput {
  qrImage: HTMLImageElement;
  headerImage: HTMLImageElement;
  shopLogoImage: HTMLImageElement;
  targetAccount: string;
  amount: number | null;
  description: string;
}

function renderSlip(input: SlipInput): string {
  const { qrImage, headerImage, shopLogoImage, targetAccount, amount, description } = input;
  const contentWidth = CANVAS_WIDTH - PADDING * 2;
  const headerHeight = Math.round((CANVAS_WIDTH * headerImage.height) / headerImage.width);

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is unavailable');
  }

  ctx.font = '15px sans-serif';
  const descriptionLines = description ? wrapText(ctx, description, contentWidth, 2) : [];

  const shopRowHeight = 56;
  const accountBlockHeight = 46;
  const qrBoxSize = 280;
  const amountBlockHeight = 58;
  const descriptionBlockHeight = descriptionLines.length ? 20 + descriptionLines.length * 20 : 0;

  const totalHeight =
    headerHeight +
    PADDING +
    shopRowHeight +
    PADDING +
    accountBlockHeight +
    PADDING +
    qrBoxSize +
    PADDING +
    amountBlockHeight +
    (descriptionLines.length ? PADDING + descriptionBlockHeight : 0) +
    PADDING;

  canvas.height = totalHeight;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, CANVAS_WIDTH, totalHeight);
  ctx.drawImage(headerImage, 0, 0, CANVAS_WIDTH, headerHeight);

  let y = headerHeight + PADDING;

  const qrBoxX = (CANVAS_WIDTH - qrBoxSize) / 2;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  roundedRectPath(ctx, qrBoxX, y, qrBoxSize, qrBoxSize, 12);
  ctx.fill();
  ctx.stroke();
  const qrInset = 20;
  ctx.drawImage(qrImage, qrBoxX + qrInset, y + qrInset, qrBoxSize - qrInset * 2, qrBoxSize - qrInset * 2);
  y += qrBoxSize + PADDING;

  const logoBoxSize = 56;
  const logoScale = Math.min(logoBoxSize / shopLogoImage.width, logoBoxSize / shopLogoImage.height);
  const logoW = shopLogoImage.width * logoScale;
  const logoH = shopLogoImage.height * logoScale;
  ctx.drawImage(shopLogoImage, PADDING, y + (logoBoxSize - logoH) / 2, logoW, logoH);

  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 20px sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(SHOP_NAME, PADDING + logoBoxSize + 12, y + logoBoxSize / 2);
  ctx.textBaseline = 'alphabetic';
  y += shopRowHeight + PADDING;

  ctx.fillStyle = '#6b7280';
  ctx.font = '13px sans-serif';
  ctx.fillText('Target account', PADDING, y);
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(targetAccount, PADDING, y + 24);
  y += accountBlockHeight + PADDING;

  ctx.fillStyle = '#6b7280';
  ctx.font = '13px sans-serif';
  ctx.fillText('Transfer amount', PADDING, y);
  if (amount !== null) {
    ctx.fillStyle = '#b8541c';
    ctx.font = 'bold 30px sans-serif';
    const amountText = `฿${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    ctx.fillText(amountText, PADDING, y + 34);
  } else {
    ctx.fillStyle = '#6b7280';
    ctx.font = 'italic 16px sans-serif';
    ctx.fillText('No fixed amount — enter in your banking app', PADDING, y + 28);
  }
  y += amountBlockHeight;

  if (descriptionLines.length) {
    y += PADDING;
    ctx.fillStyle = '#6b7280';
    ctx.font = '13px sans-serif';
    ctx.fillText('Description', PADDING, y);
    ctx.fillStyle = '#111827';
    ctx.font = '15px sans-serif';
    descriptionLines.forEach((line, index) => {
      ctx.fillText(line, PADDING, y + 20 + index * 20);
    });
  }

  return canvas.toDataURL('image/png');
}

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
    Promise.all([loadImage(HEADER_IMAGE_SRC), loadImage(SHOP_LOGO_SRC)])
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
        const dataUrl = renderSlip({
          qrImage,
          headerImage: this.headerImage!,
          shopLogoImage: this.shopLogoImage!,
          targetAccount,
          amount,
          description,
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
