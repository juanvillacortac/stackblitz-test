import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesConceptsPayrollPoliciesCalcComponent } from './companies-concepts-payroll-policies-calc.component';

describe('CompaniesConceptsPayrollPoliciesCalcComponent', () => {
  let component: CompaniesConceptsPayrollPoliciesCalcComponent;
  let fixture: ComponentFixture<CompaniesConceptsPayrollPoliciesCalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesConceptsPayrollPoliciesCalcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesConceptsPayrollPoliciesCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
