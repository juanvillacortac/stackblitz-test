import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderProductEditComponent } from './purchase-order-product-edit.component';

describe('PurchaseOrderProductEditComponent', () => {
  let component: PurchaseOrderProductEditComponent;
  let fixture: ComponentFixture<PurchaseOrderProductEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderProductEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderProductEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
