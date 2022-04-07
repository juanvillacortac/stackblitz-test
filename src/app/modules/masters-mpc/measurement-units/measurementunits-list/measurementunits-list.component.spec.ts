import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementunitsListComponent } from './measurementunits-list.component';

describe('MeasurementunitsListComponent', () => {
  let component: MeasurementunitsListComponent;
  let fixture: ComponentFixture<MeasurementunitsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeasurementunitsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurementunitsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
