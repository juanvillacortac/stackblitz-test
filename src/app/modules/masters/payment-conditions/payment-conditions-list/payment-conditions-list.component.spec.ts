import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentConditionsListComponent } from './payment-conditions-list.component';

describe('PaymentConditionsListComponent', () => {
  let component: PaymentConditionsListComponent;
  let fixture: ComponentFixture<PaymentConditionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentConditionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentConditionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
