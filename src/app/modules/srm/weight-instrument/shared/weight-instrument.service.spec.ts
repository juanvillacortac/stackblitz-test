import { TestBed } from '@angular/core/testing';

import { WeightInstrumentService } from './weight-instrument.service';

describe('WeightInstrumentService', () => {
  let service: WeightInstrumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeightInstrumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
