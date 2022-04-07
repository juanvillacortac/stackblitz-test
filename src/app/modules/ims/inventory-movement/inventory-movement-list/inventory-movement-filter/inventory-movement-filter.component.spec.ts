import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMovementFilterComponent } from './inventory-movement-filter.component';

describe('InventoryMovementFilterComponent', () => {
  let component: InventoryMovementFilterComponent;
  let fixture: ComponentFixture<InventoryMovementFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryMovementFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryMovementFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
