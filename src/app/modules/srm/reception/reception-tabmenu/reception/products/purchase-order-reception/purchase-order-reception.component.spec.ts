import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderReceptionComponent } from './purchase-order-reception.component';

describe('PurchaseOrderReceptionComponent', () => {
  let component: PurchaseOrderReceptionComponent;
  let fixture: ComponentFixture<PurchaseOrderReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderReceptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
