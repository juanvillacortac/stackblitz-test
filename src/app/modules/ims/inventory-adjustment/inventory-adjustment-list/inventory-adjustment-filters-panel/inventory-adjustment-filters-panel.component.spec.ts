import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAdjustmentFiltersPanelComponent } from './inventory-adjustment-filters-panel.component';

describe('InventoryAdjustmentFiltersPanelComponent', () => {
  let component: InventoryAdjustmentFiltersPanelComponent;
  let fixture: ComponentFixture<InventoryAdjustmentFiltersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryAdjustmentFiltersPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryAdjustmentFiltersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
