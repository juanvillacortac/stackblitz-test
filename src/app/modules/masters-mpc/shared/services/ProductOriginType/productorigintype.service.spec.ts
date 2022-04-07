import { TestBed } from '@angular/core/testing';

import { ProductorigintypeService } from './productorigintype.service';

describe('ProductorigintypeService', () => {
  let service: ProductorigintypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductorigintypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
