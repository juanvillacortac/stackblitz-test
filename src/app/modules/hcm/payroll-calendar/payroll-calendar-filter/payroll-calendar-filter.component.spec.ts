import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollCalendarFilterComponent } from './payroll-calendar-filter.component';

describe('PayrollCalendarFilterComponent', () => {
  let component: PayrollCalendarFilterComponent;
  let fixture: ComponentFixture<PayrollCalendarFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollCalendarFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollCalendarFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
