import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesConceptPayrollAssignmentComponent } from './companies-concept-payroll-assignment.component';

describe('CompaniesConceptPayrollAssignmentComponent', () => {
  let component: CompaniesConceptPayrollAssignmentComponent;
  let fixture: ComponentFixture<CompaniesConceptPayrollAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesConceptPayrollAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesConceptPayrollAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
