import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { WorkshopPage } from './workshop-page';

describe('WorkshopPage', () => {
  let component: WorkshopPage;
  let fixture: ComponentFixture<WorkshopPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkshopPage],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkshopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
