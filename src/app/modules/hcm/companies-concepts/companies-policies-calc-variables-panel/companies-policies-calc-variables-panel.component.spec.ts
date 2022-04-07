import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesPoliciesCalcVariablesPanelComponent } from './companies-policies-calc-variables-panel.component';

describe('CompaniesPoliciesCalcVariablesPanelComponent', () => {
  let component: CompaniesPoliciesCalcVariablesPanelComponent;
  let fixture: ComponentFixture<CompaniesPoliciesCalcVariablesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesPoliciesCalcVariablesPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesPoliciesCalcVariablesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
