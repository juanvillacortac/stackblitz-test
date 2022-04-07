import { TestBed } from '@angular/core/testing';

import { TaxpayertypeService } from './taxpayertype.service';

describe('TaxpayertypeService', () => {
  let service: TaxpayertypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxpayertypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
