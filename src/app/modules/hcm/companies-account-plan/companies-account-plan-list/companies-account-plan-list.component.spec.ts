import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesAccountPlanListComponent } from './companies-account-plan-list.component';

describe('CompaniesAccountPlanListComponent', () => {
  let component: CompaniesAccountPlanListComponent;
  let fixture: ComponentFixture<CompaniesAccountPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesAccountPlanListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesAccountPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
