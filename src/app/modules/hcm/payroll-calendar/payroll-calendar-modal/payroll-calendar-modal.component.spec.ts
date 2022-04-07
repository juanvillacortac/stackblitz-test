import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollCalendarModalComponent } from './payroll-calendar-modal.component';

describe('PayrollCalendarModalComponent', () => {
  let component: PayrollCalendarModalComponent;
  let fixture: ComponentFixture<PayrollCalendarModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollCalendarModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollCalendarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
