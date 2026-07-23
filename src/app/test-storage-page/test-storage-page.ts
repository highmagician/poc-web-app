import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

const NAME_STORAGE_KEY = 'poc-web-app.name';
const NUMBER_STORAGE_KEY = 'poc-web-app.number';

@Component({
  selector: 'app-test-storage-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './test-storage-page.html',
  styleUrl: './test-storage-page.scss',
})
export class TestStoragePage {
  protected readonly name = signal(localStorage.getItem(NAME_STORAGE_KEY) ?? '');
  protected readonly numberValue = signal(Number(localStorage.getItem(NUMBER_STORAGE_KEY) ?? 0));

  protected readonly output = computed(() => `${this.name()}: ${this.numberValue() * 2}`);

  protected onNameChange(value: string): void {
    this.name.set(value);
    localStorage.setItem(NAME_STORAGE_KEY, value);
  }

  protected onNumberChange(value: number): void {
    this.numberValue.set(value);
    localStorage.setItem(NUMBER_STORAGE_KEY, String(value));
  }
}
