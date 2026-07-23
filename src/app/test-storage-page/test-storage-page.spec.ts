import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TestStoragePage } from './test-storage-page';

describe('TestStoragePage', () => {
  let component: TestStoragePage;
  let fixture: ComponentFixture<TestStoragePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestStoragePage],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestStoragePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
