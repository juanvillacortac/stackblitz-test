import { TestBed } from '@angular/core/testing';

import { ProductcatalogService } from './productcatalog.service';

describe('ProductcatalogService', () => {
  let service: ProductcatalogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductcatalogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
