import { TestBed } from '@angular/core/testing';

import { ProductmultimediaService } from './productmultimedia.service';

describe('ProductmultimediaService', () => {
  let service: ProductmultimediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductmultimediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
