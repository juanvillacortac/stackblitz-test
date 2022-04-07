import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksSupervisorCalendarComponent } from './tasks-supervisor-calendar.component';

describe('TasksSupervisorCalendarComponent', () => {
  let component: TasksSupervisorCalendarComponent;
  let fixture: ComponentFixture<TasksSupervisorCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksSupervisorCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksSupervisorCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
