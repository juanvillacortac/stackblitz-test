import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesPayrollPersonaldataComponent } from './companies-payroll-personaldata.component';

describe('CompaniesPayrollPersonaldataComponent', () => {
  let component: CompaniesPayrollPersonaldataComponent;
  let fixture: ComponentFixture<CompaniesPayrollPersonaldataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesPayrollPersonaldataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesPayrollPersonaldataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
