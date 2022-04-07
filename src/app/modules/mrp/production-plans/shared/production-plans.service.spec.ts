import { TestBed } from '@angular/core/testing';

import { ProductionPlansService } from './production-plans.service';

describe('ProductionPlansService', () => {
  let service: ProductionPlansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionPlansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
