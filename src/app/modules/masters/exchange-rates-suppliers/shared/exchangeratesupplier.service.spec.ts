import { TestBed } from '@angular/core/testing';

import { ExchangeratesupplierService } from './exchangeratesupplier.service';

describe('ExchangeratesupplierService', () => {
  let service: ExchangeratesupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExchangeratesupplierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
