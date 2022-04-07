import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesConceptPayrollInstructionComponent } from './companies-concept-payroll-instruction.component';

describe('CompaniesConceptPayrollInstructionComponent', () => {
  let component: CompaniesConceptPayrollInstructionComponent;
  let fixture: ComponentFixture<CompaniesConceptPayrollInstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesConceptPayrollInstructionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesConceptPayrollInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
