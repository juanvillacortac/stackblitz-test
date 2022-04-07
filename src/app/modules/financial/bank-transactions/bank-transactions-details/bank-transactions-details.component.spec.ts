import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankTransactionsDetailsComponent } from './bank-transactions-details.component';

describe('DetailArticleComponent', () => {
  let component: BankTransactionsDetailsComponent;
  let fixture: ComponentFixture<BankTransactionsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankTransactionsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankTransactionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
