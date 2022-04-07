import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingAccountListComponent } from './accounting-account-list.component';

describe('AccountingAccountListComponent', () => {
  let component: AccountingAccountListComponent;
  let fixture: ComponentFixture<AccountingAccountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingAccountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
