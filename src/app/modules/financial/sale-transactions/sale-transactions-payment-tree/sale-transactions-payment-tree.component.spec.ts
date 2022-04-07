import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTransactionsPaymentTreeComponent } from './sale-transactions-payment-tree.component';

describe('SaleTransactionsPaymentTreeComponent', () => {
  let component: SaleTransactionsPaymentTreeComponent;
  let fixture: ComponentFixture<SaleTransactionsPaymentTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleTransactionsPaymentTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTransactionsPaymentTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
