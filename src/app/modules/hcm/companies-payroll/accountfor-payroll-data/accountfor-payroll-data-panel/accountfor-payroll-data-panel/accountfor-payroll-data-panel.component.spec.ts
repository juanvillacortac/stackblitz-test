import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountforPayrollDataPanelComponent } from './accountfor-payroll-data-panel.component';

describe('AccountforPayrollDataPanelComponent', () => {
  let component: AccountforPayrollDataPanelComponent;
  let fixture: ComponentFixture<AccountforPayrollDataPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountforPayrollDataPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountforPayrollDataPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
