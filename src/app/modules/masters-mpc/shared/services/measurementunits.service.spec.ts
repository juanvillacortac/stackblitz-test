import { TestBed } from '@angular/core/testing';

import { MeasurementunitsService } from './measurementunits.service';

describe('MeasurementunitsService', () => {
  let service: MeasurementunitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasurementunitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
