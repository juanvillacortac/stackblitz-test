import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryAdjustmentMassiveComponent } from './salary-adjustment-massive.component';

describe('SalaryAdjustmentMassiveComponent', () => {
  let component: SalaryAdjustmentMassiveComponent;
  let fixture: ComponentFixture<SalaryAdjustmentMassiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryAdjustmentMassiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryAdjustmentMassiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
