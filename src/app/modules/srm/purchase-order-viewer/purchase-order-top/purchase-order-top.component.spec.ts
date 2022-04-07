import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderTopComponent } from './purchase-order-top.component';

describe('PurchaseOrderTopComponent', () => {
  let component: PurchaseOrderTopComponent;
  let fixture: ComponentFixture<PurchaseOrderTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderTopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
