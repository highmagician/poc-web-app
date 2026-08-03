import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirebasePage } from './firebase-page';
import { provideRouter } from '@angular/router';

describe('FirebasePage', () => {
  let component: FirebasePage;
  let fixture: ComponentFixture<FirebasePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirebasePage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FirebasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
