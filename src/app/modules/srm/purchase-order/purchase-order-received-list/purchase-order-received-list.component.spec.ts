import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderReceivedListComponent } from './purchase-order-received-list.component';

describe('PurchaseOrderReceivedListComponent', () => {
  let component: PurchaseOrderReceivedListComponent;
  let fixture: ComponentFixture<PurchaseOrderReceivedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderReceivedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderReceivedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
