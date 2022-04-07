import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInventoryMovementComponent } from './product-inventory-movement.component';

describe('ProductInventoryMovementComponent', () => {
  let component: ProductInventoryMovementComponent;
  let fixture: ComponentFixture<ProductInventoryMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductInventoryMovementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductInventoryMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
