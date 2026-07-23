import { Component, inject } from '@angular/core';

import { LanguageService } from '../../i18n/language.service';
import { Language } from '../../i18n/translations';

@Component({
  selector: 'app-top-bar',
  imports: [],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar {
  protected readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.t;

  protected setLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }
}
