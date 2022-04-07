import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesConceptPayrollConditionComponent } from './companies-concept-payroll-condition.component';

describe('CompaniesConceptPayrollConditionComponent', () => {
  let component: CompaniesConceptPayrollConditionComponent;
  let fixture: ComponentFixture<CompaniesConceptPayrollConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesConceptPayrollConditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesConceptPayrollConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
