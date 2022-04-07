import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTransactionsDiscountTreeComponent } from './sale-transactions-discount-tree.component';

describe('SaleTransactionsDiscountTreeComponent', () => {
  let component: SaleTransactionsDiscountTreeComponent;
  let fixture: ComponentFixture<SaleTransactionsDiscountTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleTransactionsDiscountTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTransactionsDiscountTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
