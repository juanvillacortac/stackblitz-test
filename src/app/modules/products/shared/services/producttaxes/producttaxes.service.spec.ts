import { TestBed } from '@angular/core/testing';

import { ProducttaxesService } from './producttaxes.service';

describe('ProducttaxesService', () => {
  let service: ProducttaxesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProducttaxesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
