import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { CheckStatusLoginPage } from './check-status-login-page';

describe('CheckStatusLoginPage', () => {
  let component: CheckStatusLoginPage;
  let fixture: ComponentFixture<CheckStatusLoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckStatusLoginPage],
      providers: [provideRouter([]), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckStatusLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
