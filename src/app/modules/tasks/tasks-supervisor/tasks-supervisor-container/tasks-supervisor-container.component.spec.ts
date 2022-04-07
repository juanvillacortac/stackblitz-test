import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksSupervisorContainerComponent } from './tasks-supervisor-container.component';

describe('TasksSupervisorContainerComponent', () => {
  let component: TasksSupervisorContainerComponent;
  let fixture: ComponentFixture<TasksSupervisorContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksSupervisorContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksSupervisorContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
