import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryAdjustmentImportComponent } from './salary-adjustment-import.component';

describe('SalaryAdjustmentImportComponent', () => {
  let component: SalaryAdjustmentImportComponent;
  let fixture: ComponentFixture<SalaryAdjustmentImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryAdjustmentImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryAdjustmentImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
