import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderProductsComponent } from './purchase-order-products.component';

describe('PurchaseOrderProductsComponent', () => {
  let component: PurchaseOrderProductsComponent;
  let fixture: ComponentFixture<PurchaseOrderProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
