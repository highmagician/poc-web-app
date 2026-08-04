import { Injectable, signal } from '@angular/core';

const PROMPTPAY_ID_STORAGE_KEY = 'poc-web-app.promptPayId';
const DEFAULT_PROMPTPAY_ID = '0812345678';

// Bank of Thailand PromptPay IDs are a 10-digit phone number, a 13-digit citizen/tax ID,
// or a 15-digit e-Wallet account ID (see the `promptpay-qr` package this feeds).
const PROMPTPAY_ID_PATTERN = /^\d{10}$|^\d{13}$|^\d{15}$/;

function readStoredPromptPayId(): string {
  const stored = localStorage.getItem(PROMPTPAY_ID_STORAGE_KEY);
  return stored && PROMPTPAY_ID_PATTERN.test(stored) ? stored : DEFAULT_PROMPTPAY_ID;
}

export function isValidPromptPayId(value: string): boolean {
  return PROMPTPAY_ID_PATTERN.test(value);
}

@Injectable({ providedIn: 'root' })
export class PromptPayConfigService {
  readonly promptPayId = signal<string>(readStoredPromptPayId());

  setPromptPayId(value: string): boolean {
    if (!isValidPromptPayId(value)) {
      return false;
    }

    this.promptPayId.set(value);
    localStorage.setItem(PROMPTPAY_ID_STORAGE_KEY, value);
    return true;
  }
}
