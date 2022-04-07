import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributedPurchaseOrderComponent } from './distributed-purchase-order.component';

describe('DistributedPurchaseOrderComponent', () => {
  let component: DistributedPurchaseOrderComponent;
  let fixture: ComponentFixture<DistributedPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributedPurchaseOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributedPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
