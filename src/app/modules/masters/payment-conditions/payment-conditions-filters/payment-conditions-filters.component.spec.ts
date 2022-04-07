import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentConditionsFiltersComponent } from './payment-conditions-filters.component';

describe('PaymentConditionsFiltersComponent', () => {
  let component: PaymentConditionsFiltersComponent;
  let fixture: ComponentFixture<PaymentConditionsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentConditionsFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentConditionsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
