import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectivesByDepartmentComponent } from './objectives-by-department.component';

describe('ObjectivesByDepartmentComponent', () => {
  let component: ObjectivesByDepartmentComponent;
  let fixture: ComponentFixture<ObjectivesByDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectivesByDepartmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectivesByDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
