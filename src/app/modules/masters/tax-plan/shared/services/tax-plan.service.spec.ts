import { TestBed } from '@angular/core/testing';

import { TaxPlanService } from './tax-plan.service';

describe('AuxiliaryService', () => {
  let service: TaxPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
