import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankTransactionsFiltersComponent } from './bank-transactions-filters.component';

describe('FiscalYearFiltersComponent', () => {
  let component: BankTransactionsFiltersComponent;
  let fixture: ComponentFixture<BankTransactionsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankTransactionsFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankTransactionsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
