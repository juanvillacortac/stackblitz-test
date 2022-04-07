import { TestBed } from '@angular/core/testing';

import { BankTransactionService } from './bank-transaction.service';

describe('AuxiliaryService', () => {
  let service: BankTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
