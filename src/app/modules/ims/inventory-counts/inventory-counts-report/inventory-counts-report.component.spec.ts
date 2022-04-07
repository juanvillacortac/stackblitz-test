import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCountsReportComponent } from './inventory-counts-report.component';

describe('InventoryCountsReportComponent', () => {
  let component: InventoryCountsReportComponent;
  let fixture: ComponentFixture<InventoryCountsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryCountsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCountsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
