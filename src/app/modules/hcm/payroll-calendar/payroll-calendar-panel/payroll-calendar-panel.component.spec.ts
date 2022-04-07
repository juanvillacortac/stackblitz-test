import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollCalendarPanelComponent } from './payroll-calendar-panel.component';

describe('PayrollCalendarPanelComponent', () => {
  let component: PayrollCalendarPanelComponent;
  let fixture: ComponentFixture<PayrollCalendarPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollCalendarPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollCalendarPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
