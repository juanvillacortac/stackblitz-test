import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterVehicleFilterComponent } from './master-vehicle-filter.component';

describe('MasterVehicleFilterComponent', () => {
  let component: MasterVehicleFilterComponent;
  let fixture: ComponentFixture<MasterVehicleFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterVehicleFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterVehicleFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
