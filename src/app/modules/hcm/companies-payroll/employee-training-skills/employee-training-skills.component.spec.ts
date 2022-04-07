import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTrainingSkillsComponent } from './employee-training-skills.component';

describe('EmployeeTrainingSkillsComponent', () => {
  let component: EmployeeTrainingSkillsComponent;
  let fixture: ComponentFixture<EmployeeTrainingSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTrainingSkillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTrainingSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
