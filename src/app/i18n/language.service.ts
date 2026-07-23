import { Injectable, computed, signal } from '@angular/core';
import { Language, TRANSLATIONS } from './translations';

const LANGUAGE_STORAGE_KEY = 'poc-web-app.language';

function readStoredLanguage(): Language {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored === 'th' ? 'th' : 'en';
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly language = signal<Language>(readStoredLanguage());
  readonly t = computed(() => TRANSLATIONS[this.language()]);

  setLanguage(language: Language): void {
    this.language.set(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }

  toggle(): void {
    this.setLanguage(this.language() === 'en' ? 'th' : 'en');
  }
}
