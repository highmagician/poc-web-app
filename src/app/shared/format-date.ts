import { Language } from '../i18n/translations';

export function formatSessionDate(iso: string, language: Language): string {
  const locale = language === 'th' ? 'th-TH-u-ca-buddhist' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));
}

export function formatTimestamp(iso: string, language: Language): string {
  const locale = language === 'th' ? 'th-TH-u-ca-buddhist' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}
