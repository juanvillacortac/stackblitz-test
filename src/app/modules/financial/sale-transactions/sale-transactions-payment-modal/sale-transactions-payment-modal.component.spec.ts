import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTransactionsPaymentModalComponent } from './sale-transactions-payment-modal.component';

describe('SaleTransactionsPaymentModalComponent', () => {
  let component: SaleTransactionsPaymentModalComponent;
  let fixture: ComponentFixture<SaleTransactionsPaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleTransactionsPaymentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTransactionsPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
