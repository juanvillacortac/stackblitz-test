import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountSuppliersModalComponent } from './bank-account-suppliers-modal.component';

describe('BankAccountSuppliersModalComponent', () => {
  let component: BankAccountSuppliersModalComponent;
  let fixture: ComponentFixture<BankAccountSuppliersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAccountSuppliersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountSuppliersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
