import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesConceptsPayrollpoliciesPanelComponent } from './companies-concepts-payroll-policies-panel.component';

describe('CompaniesConceptsPayrollpoliciesComponent', () => {
  let component: CompaniesConceptsPayrollpoliciesPanelComponent;
  let fixture: ComponentFixture<CompaniesConceptsPayrollpoliciesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesConceptsPayrollpoliciesPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesConceptsPayrollpoliciesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
