import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTrainingPanelComponent } from './employee-training-panel.component';

describe('EmployeeTrainingPanelComponent', () => {
  let component: EmployeeTrainingPanelComponent;
  let fixture: ComponentFixture<EmployeeTrainingPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTrainingPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTrainingPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
