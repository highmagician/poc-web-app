import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { FcmDemoPage } from './fcm-demo-page';

describe('FcmDemoPage', () => {
  let component: FcmDemoPage;
  let fixture: ComponentFixture<FcmDemoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FcmDemoPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FcmDemoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
