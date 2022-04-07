import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryAdjustmentJobPositionComponent } from './salary-adjustment-job-position.component';

describe('SalaryAdjustmentJobPositionComponent', () => {
  let component: SalaryAdjustmentJobPositionComponent;
  let fixture: ComponentFixture<SalaryAdjustmentJobPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryAdjustmentJobPositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryAdjustmentJobPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
