import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryAdjustmentSingleComponent } from './salary-adjustment-single.component';

describe('SalaryAdjustmentSingleComponent', () => {
  let component: SalaryAdjustmentSingleComponent;
  let fixture: ComponentFixture<SalaryAdjustmentSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryAdjustmentSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryAdjustmentSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
