import { TestBed } from '@angular/core/testing';

import { FiscalYearService } from './fiscal-year.service';

describe('AuxiliaryService', () => {
  let service: FiscalYearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiscalYearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
