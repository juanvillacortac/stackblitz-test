import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryAdjustmentTableComponent } from './salary-adjustment-table.component';

describe('SalaryAdjustmentTableComponent', () => {
  let component: SalaryAdjustmentTableComponent;
  let fixture: ComponentFixture<SalaryAdjustmentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryAdjustmentTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryAdjustmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
