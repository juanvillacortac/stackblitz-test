import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTrainingListComponent } from './employee-training-list.component';

describe('EmployeeTrainingListComponent', () => {
  let component: EmployeeTrainingListComponent;
  let fixture: ComponentFixture<EmployeeTrainingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTrainingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTrainingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
