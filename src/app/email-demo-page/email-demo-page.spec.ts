import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { EmailDemoPage } from './email-demo-page';

describe('EmailDemoPage', () => {
  let component: EmailDemoPage;
  let fixture: ComponentFixture<EmailDemoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailDemoPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailDemoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
