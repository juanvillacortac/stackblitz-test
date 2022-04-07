import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollCalendarListComponent } from './payroll-calendar-list.component';

describe('PayrollCalendarListComponent', () => {
  let component: PayrollCalendarListComponent;
  let fixture: ComponentFixture<PayrollCalendarListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollCalendarListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollCalendarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
