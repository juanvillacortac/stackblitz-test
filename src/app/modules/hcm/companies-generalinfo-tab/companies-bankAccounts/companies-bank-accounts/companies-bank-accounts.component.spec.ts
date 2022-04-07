import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesBankAccountsComponent } from './companies-bank-accounts.component';

describe('CompaniesBankAccountsComponent', () => {
  let component: CompaniesBankAccountsComponent;
  let fixture: ComponentFixture<CompaniesBankAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesBankAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesBankAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
