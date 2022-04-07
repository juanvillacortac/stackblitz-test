import { TestBed } from '@angular/core/testing';

import { SuppliercatalogService } from './suppliercatalog.service';

describe('SuppliercatalogService', () => {
  let service: SuppliercatalogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuppliercatalogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
