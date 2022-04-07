import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderPriceComponent } from './purchase-order-price.component';

describe('PurchaseOrderPriceComponent', () => {
  let component: PurchaseOrderPriceComponent;
  let fixture: ComponentFixture<PurchaseOrderPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
