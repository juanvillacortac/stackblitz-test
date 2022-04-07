import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalaryAdjustmentComponent } from './employee-salary-adjustment.component';

describe('EmployeeSalaryAdjustmentComponent', () => {
  let component: EmployeeSalaryAdjustmentComponent;
  let fixture: ComponentFixture<EmployeeSalaryAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeSalaryAdjustmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSalaryAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
