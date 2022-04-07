import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAdjustmentFiltersComponent } from './inventory-adjustment-filters.component';

describe('InventoryAdjustmentFiltersComponent', () => {
  let component: InventoryAdjustmentFiltersComponent;
  let fixture: ComponentFixture<InventoryAdjustmentFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryAdjustmentFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryAdjustmentFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
