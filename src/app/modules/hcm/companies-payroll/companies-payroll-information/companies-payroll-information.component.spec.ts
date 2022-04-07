import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesPayrollInformationComponent } from './companies-payroll-information.component';

describe('CompaniesPayrollInformationComponent', () => {
  let component: CompaniesPayrollInformationComponent;
  let fixture: ComponentFixture<CompaniesPayrollInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesPayrollInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesPayrollInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
