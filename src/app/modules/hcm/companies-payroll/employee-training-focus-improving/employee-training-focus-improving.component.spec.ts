import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTrainingFocusImprovingComponent } from './employee-training-focus-improving.component';

describe('EmployeeTrainingFocusImprovingComponent', () => {
  let component: EmployeeTrainingFocusImprovingComponent;
  let fixture: ComponentFixture<EmployeeTrainingFocusImprovingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTrainingFocusImprovingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTrainingFocusImprovingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
