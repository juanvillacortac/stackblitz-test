import { TestBed } from '@angular/core/testing';

import { CollectionTransactionsService } from './collection-transactions.service';

describe('CollectionTransactionsService', () => {
  let service: CollectionTransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
