import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingAccountFiltersComponent } from './accounting-account-filters.component';

describe('AccountingAccountFiltersComponent', () => {
  let component: AccountingAccountFiltersComponent;
  let fixture: ComponentFixture<AccountingAccountFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingAccountFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingAccountFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
