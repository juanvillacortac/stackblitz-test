import { TestBed } from '@angular/core/testing';

import { SaleTransactionService } from './sale-transaction.service';

describe('SaleTransactionService', () => {
  let service: SaleTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
