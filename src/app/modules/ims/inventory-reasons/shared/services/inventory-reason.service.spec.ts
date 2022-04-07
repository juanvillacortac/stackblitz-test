import { TestBed } from '@angular/core/testing';

import { InventoryReasonService } from './inventory-reason.service';

describe('InventoryReasonService', () => {
  let service: InventoryReasonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryReasonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
