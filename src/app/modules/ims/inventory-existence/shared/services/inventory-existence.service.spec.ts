import { TestBed } from '@angular/core/testing';

import { InventoryExistenceService } from './inventory-existence.service';

describe('InventoryExistenceService', () => {
  let service: InventoryExistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryExistenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
