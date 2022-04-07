import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesAccountPlanPanelComponent } from './companies-account-plan-panel.component';

describe('CompaniesAccountPlanPanelComponent', () => {
  let component: CompaniesAccountPlanPanelComponent;
  let fixture: ComponentFixture<CompaniesAccountPlanPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesAccountPlanPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesAccountPlanPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
