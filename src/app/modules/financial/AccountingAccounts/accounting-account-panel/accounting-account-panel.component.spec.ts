import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingAccountPanelComponent } from './accounting-account-panel.component';

describe('AccountingAccountPanelComponent', () => {
  let component: AccountingAccountPanelComponent;
  let fixture: ComponentFixture<AccountingAccountPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingAccountPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingAccountPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
