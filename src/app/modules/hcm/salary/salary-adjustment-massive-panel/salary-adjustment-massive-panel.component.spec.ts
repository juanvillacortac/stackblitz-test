import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryAdjustmentMassivePanelComponent } from './salary-adjustment-massive-panel.component';

describe('SalaryAdjustmentMassivePanelComponent', () => {
  let component: SalaryAdjustmentMassivePanelComponent;
  let fixture: ComponentFixture<SalaryAdjustmentMassivePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryAdjustmentMassivePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryAdjustmentMassivePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
