import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingAccountSuppliersComponent } from './accounting-account-suppliers.component';

describe('BankAccountSuppliersComponent', () => {
  let component: AccountingAccountSuppliersComponent;
  let fixture: ComponentFixture<AccountingAccountSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingAccountSuppliersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingAccountSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
