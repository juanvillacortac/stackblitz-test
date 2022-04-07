import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesConceptPayrollConditionalComponent } from './companies-concept-payroll-conditional.component';

describe('CompaniesConceptPayrollConditionalComponent', () => {
  let component: CompaniesConceptPayrollConditionalComponent;
  let fixture: ComponentFixture<CompaniesConceptPayrollConditionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesConceptPayrollConditionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesConceptPayrollConditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
