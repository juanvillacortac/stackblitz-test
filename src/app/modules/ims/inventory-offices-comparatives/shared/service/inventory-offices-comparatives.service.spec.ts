import { TestBed } from '@angular/core/testing';

import { InventoryOfficesComparativesService } from './inventory-offices-comparatives.service';

describe('InventoryOfficesComparativesService', () => {
  let service: InventoryOfficesComparativesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryOfficesComparativesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
