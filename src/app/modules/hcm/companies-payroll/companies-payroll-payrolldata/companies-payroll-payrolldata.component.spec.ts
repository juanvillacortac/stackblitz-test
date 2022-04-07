import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesPayrollPayrolldataComponent } from './companies-payroll-payrolldata.component';

describe('CompaniesPayrollPayrolldataComponent', () => {
  let component: CompaniesPayrollPayrolldataComponent;
  let fixture: ComponentFixture<CompaniesPayrollPayrolldataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesPayrollPayrolldataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesPayrollPayrolldataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
