import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCountsReportFiltersComponent } from './inventory-counts-report-filters.component';

describe('InventoryCountsReportFiltersComponent', () => {
  let component: InventoryCountsReportFiltersComponent;
  let fixture: ComponentFixture<InventoryCountsReportFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryCountsReportFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCountsReportFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
