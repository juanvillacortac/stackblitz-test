import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryAdjustmentJobPositionPanelComponent } from './salary-adjustment-job-position-panel.component';

describe('SalaryAdjustmentJobPositionPanelComponent', () => {
  let component: SalaryAdjustmentJobPositionPanelComponent;
  let fixture: ComponentFixture<SalaryAdjustmentJobPositionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryAdjustmentJobPositionPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryAdjustmentJobPositionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
