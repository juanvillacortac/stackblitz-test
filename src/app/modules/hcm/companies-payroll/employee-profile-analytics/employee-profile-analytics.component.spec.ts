import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeProfileAnalyticsComponent } from './employee-profile-analytics.component';

describe('EmployeeProfileAnalyticsComponent', () => {
  let component: EmployeeProfileAnalyticsComponent;
  let fixture: ComponentFixture<EmployeeProfileAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeProfileAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeProfileAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
