import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ApplyPage } from './apply-page';

describe('ApplyPage', () => {
  let component: ApplyPage;
  let fixture: ComponentFixture<ApplyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyPage],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
