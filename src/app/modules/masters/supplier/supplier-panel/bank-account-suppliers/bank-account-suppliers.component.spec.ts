import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountSuppliersComponent } from './bank-account-suppliers.component';

describe('BankAccountSuppliersComponent', () => {
  let component: BankAccountSuppliersComponent;
  let fixture: ComponentFixture<BankAccountSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAccountSuppliersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
