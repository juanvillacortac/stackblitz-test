import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksSupervisorDashboardComponent } from './tasks-supervisor-dashboard.component';

describe('TasksSupervisorDashboardComponent', () => {
  let component: TasksSupervisorDashboardComponent;
  let fixture: ComponentFixture<TasksSupervisorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksSupervisorDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksSupervisorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
