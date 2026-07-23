import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CheckoutPage } from './checkout-page';

describe('CheckoutPage', () => {
  let component: CheckoutPage;
  let fixture: ComponentFixture<CheckoutPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutPage],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
