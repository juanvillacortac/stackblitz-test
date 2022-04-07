import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryDashboardTabComponent } from './salary-dashboard-tab.component';

describe('SalaryDashboardTabComponent', () => {
  let component: SalaryDashboardTabComponent;
  let fixture: ComponentFixture<SalaryDashboardTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryDashboardTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryDashboardTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
