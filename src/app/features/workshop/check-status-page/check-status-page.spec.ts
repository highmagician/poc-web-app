import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { CheckStatusPage } from './check-status-page';

describe('CheckStatusPage', () => {
  let component: CheckStatusPage;
  let fixture: ComponentFixture<CheckStatusPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckStatusPage],
      providers: [provideRouter([]), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
