import { TestBed } from '@angular/core/testing';

import { LedgerAccountCategoryService } from './ledger-account-category.service';

describe('LedgerAccountCategoryService', () => {
  let service: LedgerAccountCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LedgerAccountCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
