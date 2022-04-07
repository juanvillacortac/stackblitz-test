import { TestBed } from '@angular/core/testing';

import { ProductbranchofficeService } from './productbranchoffice.service';

describe('ProductbranchofficeService', () => {
  let service: ProductbranchofficeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductbranchofficeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
