import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesConceptPayrollExpressionComponent } from './companies-concept-payroll-expression.component';

describe('CompaniesConceptPayrollExpressionComponent', () => {
  let component: CompaniesConceptPayrollExpressionComponent;
  let fixture: ComponentFixture<CompaniesConceptPayrollExpressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesConceptPayrollExpressionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesConceptPayrollExpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
