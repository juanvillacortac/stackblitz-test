import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryAdjustmentSinglePanelComponent } from './salary-adjustment-single-panel.component';

describe('SalaryAdjustmentSinglePanelComponent', () => {
  let component: SalaryAdjustmentSinglePanelComponent;
  let fixture: ComponentFixture<SalaryAdjustmentSinglePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryAdjustmentSinglePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryAdjustmentSinglePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
