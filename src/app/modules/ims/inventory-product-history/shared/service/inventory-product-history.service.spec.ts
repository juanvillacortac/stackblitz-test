import { TestBed } from '@angular/core/testing';

import { InventoryProductHistoryService } from './inventory-product-history.service';

describe('InventoryProductHistoryService', () => {
  let service: InventoryProductHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryProductHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
