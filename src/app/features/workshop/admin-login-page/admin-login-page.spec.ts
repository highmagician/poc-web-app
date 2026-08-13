import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AdminLoginPage } from './admin-login-page';

describe('AdminLoginPage', () => {
  let component: AdminLoginPage;
  let fixture: ComponentFixture<AdminLoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLoginPage],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
