import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentConditionsDetailComponent } from './payment-conditions-detail.component';

describe('PaymentConditionsDetailComponent', () => {
  let component: PaymentConditionsDetailComponent;
  let fixture: ComponentFixture<PaymentConditionsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentConditionsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentConditionsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
