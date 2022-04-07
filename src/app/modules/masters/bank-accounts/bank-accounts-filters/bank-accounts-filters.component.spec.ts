import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountsFiltersComponent } from './bank-accounts-filters.component';

describe('BankAccountsFiltersComponent', () => {
  let component: BankAccountsFiltersComponent;
  let fixture: ComponentFixture<BankAccountsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAccountsFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
