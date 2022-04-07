import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscalYearFiltersComponent } from './fiscal-year-filters.component';

describe('FiscalYearFiltersComponent', () => {
  let component: FiscalYearFiltersComponent;
  let fixture: ComponentFixture<FiscalYearFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiscalYearFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiscalYearFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
