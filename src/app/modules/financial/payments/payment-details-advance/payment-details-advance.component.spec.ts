import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailsAdvanceComponent } from './payment-details-advance.component';

describe('PaymentDetailsAdvanceComponent', () => {
  let component: PaymentDetailsAdvanceComponent;
  let fixture: ComponentFixture<PaymentDetailsAdvanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDetailsAdvanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailsAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
