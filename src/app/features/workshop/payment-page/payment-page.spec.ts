import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PaymentPage } from './payment-page';

describe('PaymentPage', () => {
  let component: PaymentPage;
  let fixture: ComponentFixture<PaymentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentPage],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
