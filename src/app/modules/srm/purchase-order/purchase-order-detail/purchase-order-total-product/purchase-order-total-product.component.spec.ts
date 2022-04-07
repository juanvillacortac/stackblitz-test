import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderTotalProductComponent } from './purchase-order-total-product.component';

describe('PurchaseOrderTotalProductComponent', () => {
  let component: PurchaseOrderTotalProductComponent;
  let fixture: ComponentFixture<PurchaseOrderTotalProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderTotalProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderTotalProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
