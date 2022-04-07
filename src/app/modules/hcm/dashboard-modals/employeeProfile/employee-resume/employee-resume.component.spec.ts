import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeResumeComponent } from './employee-resume.component';

describe('EmployeeResumeComponent', () => {
  let component: EmployeeResumeComponent;
  let fixture: ComponentFixture<EmployeeResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeResumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
