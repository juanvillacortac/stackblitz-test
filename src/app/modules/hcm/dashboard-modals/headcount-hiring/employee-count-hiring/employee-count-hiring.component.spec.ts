import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCountHiringComponent } from './employee-count-hiring.component';

describe('EmployeeCountHiringComponent', () => {
  let component: EmployeeCountHiringComponent;
  let fixture: ComponentFixture<EmployeeCountHiringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeCountHiringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeCountHiringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
