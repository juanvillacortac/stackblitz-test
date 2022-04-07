import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDriversReportListComponent } from './vehicle-drivers-report-list.component';

describe('VehicleDriversReportListComponent', () => {
  let component: VehicleDriversReportListComponent;
  let fixture: ComponentFixture<VehicleDriversReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDriversReportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDriversReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
