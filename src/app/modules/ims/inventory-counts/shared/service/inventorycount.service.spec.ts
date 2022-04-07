import { TestBed } from '@angular/core/testing';

import { InventorycountService } from './inventorycount.service';

describe('InventorycountService', () => {
  let service: InventorycountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventorycountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
