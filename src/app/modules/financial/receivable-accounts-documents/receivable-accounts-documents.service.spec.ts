import { TestBed } from '@angular/core/testing';

import { ReceivableAccountsDocumentsService } from './receivable-accounts-documents.service';

describe('ReceivableAccountsDocumentsService', () => {
  let service: ReceivableAccountsDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceivableAccountsDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
