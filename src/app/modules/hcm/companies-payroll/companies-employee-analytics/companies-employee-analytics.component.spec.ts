import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesEmployeeAnalyticsComponent } from './companies-employee-analytics.component';

describe('CompaniesEmployeeAnalyticsComponent', () => {
  let component: CompaniesEmployeeAnalyticsComponent;
  let fixture: ComponentFixture<CompaniesEmployeeAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesEmployeeAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesEmployeeAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
