import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksSupervisorAddComponent } from './tasks-supervisor-add.component';

describe('TasksSupervisorAddComponent', () => {
  let component: TasksSupervisorAddComponent;
  let fixture: ComponentFixture<TasksSupervisorAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksSupervisorAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksSupervisorAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
