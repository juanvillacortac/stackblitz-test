import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderProductPanelComponent } from './purchase-order-product-panel.component';

describe('PurchaseOrderProductPanelComponent', () => {
  let component: PurchaseOrderProductPanelComponent;
  let fixture: ComponentFixture<PurchaseOrderProductPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderProductPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderProductPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
