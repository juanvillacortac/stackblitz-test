import { TestBed } from '@angular/core/testing';

import { ProductionOrdersService } from './production-orders.service';

describe('ProductionOrdersService', () => {
  let service: ProductionOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
