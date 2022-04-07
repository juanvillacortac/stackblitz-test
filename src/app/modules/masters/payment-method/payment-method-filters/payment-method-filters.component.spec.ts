import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodFiltersComponent } from './payment-method-filters.component';

describe('PaymentMethodFiltersComponent', () => {
  let component: PaymentMethodFiltersComponent;
  let fixture: ComponentFixture<PaymentMethodFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentMethodFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMethodFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
