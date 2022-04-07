import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscalYearDetailsComponent } from './fiscal-year-details.component';

describe('FiscalYearDetailsComponent', () => {
  let component: FiscalYearDetailsComponent;
  let fixture: ComponentFixture<FiscalYearDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiscalYearDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiscalYearDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
