import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTransactionsDiscountModalComponent } from './sale-transactions-discount-modal.component';

describe('SaleTransactionsDiscountModalComponent', () => {
  let component: SaleTransactionsDiscountModalComponent;
  let fixture: ComponentFixture<SaleTransactionsDiscountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleTransactionsDiscountModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTransactionsDiscountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
