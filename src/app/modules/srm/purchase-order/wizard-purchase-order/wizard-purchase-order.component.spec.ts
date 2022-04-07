import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardPurchaseOrderComponent } from './wizard-purchase-order.component';

describe('WizardPurchaseOrderComponent', () => {
  let component: WizardPurchaseOrderComponent;
  let fixture: ComponentFixture<WizardPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WizardPurchaseOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
