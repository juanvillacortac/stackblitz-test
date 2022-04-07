import { TestBed } from '@angular/core/testing';

import { InternalBankTransferService } from './internal-bank-transfer.service';

describe('InternalBankTransferService', () => {
  let service: InternalBankTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternalBankTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
