import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxPlanFiltersComponent } from './tax-plan-filters.component';

describe('TaxPlanFiltersComponent', () => {
  let component: TaxPlanFiltersComponent;
  let fixture: ComponentFixture<TaxPlanFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxPlanFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxPlanFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
