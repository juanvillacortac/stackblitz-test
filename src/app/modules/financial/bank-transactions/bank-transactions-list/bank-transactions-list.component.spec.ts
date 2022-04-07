import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankTransactionsListComponent } from './bank-transactions-list.component';

describe('BankTransactionsListComponent', () => {
  let component: BankTransactionsListComponent;
  let fixture: ComponentFixture<BankTransactionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankTransactionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
