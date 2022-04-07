import { TestBed } from '@angular/core/testing';

import { InventoryPackOperationService } from './inventory-pack-operation.service';

describe('InventoryPackOperationService', () => {
  let service: InventoryPackOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryPackOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
