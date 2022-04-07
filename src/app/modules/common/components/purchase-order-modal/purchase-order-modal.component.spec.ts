import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderModalComponent } from './purchase-order-modal.component';

describe('PurchaseOrderModalComponent', () => {
  let component: PurchaseOrderModalComponent;
  let fixture: ComponentFixture<PurchaseOrderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
