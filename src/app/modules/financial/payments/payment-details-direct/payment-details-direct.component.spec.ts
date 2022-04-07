import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailsDirectComponent } from './payment-details-direct.component';

describe('PaymentDetailsDirectComponent', () => {
  let component: PaymentDetailsDirectComponent;
  let fixture: ComponentFixture<PaymentDetailsDirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDetailsDirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailsDirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
