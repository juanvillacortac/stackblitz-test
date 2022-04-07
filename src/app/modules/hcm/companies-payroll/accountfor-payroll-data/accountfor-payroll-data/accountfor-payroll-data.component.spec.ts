import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBankAccountsComponent } from './company-bank-accounts.component';

describe('CompanyBankAccountsComponent', () => {
  let component: CompanyBankAccountsComponent;
  let fixture: ComponentFixture<CompanyBankAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyBankAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyBankAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
