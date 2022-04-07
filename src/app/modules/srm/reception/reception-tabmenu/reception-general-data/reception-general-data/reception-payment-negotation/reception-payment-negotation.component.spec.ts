import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionPaymentNegotationComponent } from './reception-payment-negotation.component';

describe('ReceptionPaymentNegotationComponent', () => {
  let component: ReceptionPaymentNegotationComponent;
  let fixture: ComponentFixture<ReceptionPaymentNegotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionPaymentNegotationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionPaymentNegotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
