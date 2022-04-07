import { TestBed } from '@angular/core/testing';

import { PriceGroupingService } from './price-grouping.service';

describe('PriceGroupingService', () => {
  let service: PriceGroupingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceGroupingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
