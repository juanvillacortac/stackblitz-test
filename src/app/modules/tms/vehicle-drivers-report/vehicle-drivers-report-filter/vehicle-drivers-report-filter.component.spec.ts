import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDriversReportFilterComponent } from './vehicle-drivers-report-filter.component';

describe('VehicleDriversReportFilterComponent', () => {
  let component: VehicleDriversReportFilterComponent;
  let fixture: ComponentFixture<VehicleDriversReportFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDriversReportFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDriversReportFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
