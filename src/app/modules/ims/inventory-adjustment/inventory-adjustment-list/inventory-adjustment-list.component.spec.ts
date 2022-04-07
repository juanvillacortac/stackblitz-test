import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAdjustmentListComponent } from './inventory-adjustment-list.component';

describe('InventoryAdjustmentListComponent', () => {
  let component: InventoryAdjustmentListComponent;
  let fixture: ComponentFixture<InventoryAdjustmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryAdjustmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryAdjustmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
