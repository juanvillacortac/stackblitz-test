import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksSupervisorListComponent } from './tasks-supervisor-list.component';

describe('TasksSupervisorListComponent', () => {
  let component: TasksSupervisorListComponent;
  let fixture: ComponentFixture<TasksSupervisorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksSupervisorListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksSupervisorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
