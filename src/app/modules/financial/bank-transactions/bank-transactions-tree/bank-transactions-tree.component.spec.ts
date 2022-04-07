import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankTransactionsTreeComponent } from './bank-transactions-tree.component';

describe('BankTransactionsTreeComponent', () => {
  let component: BankTransactionsTreeComponent;
  let fixture: ComponentFixture<BankTransactionsTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankTransactionsTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankTransactionsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
