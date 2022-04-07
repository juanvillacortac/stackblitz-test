import { TestBed } from '@angular/core/testing';

import { ProductassociationService } from './productassociation.service';

describe('ProductassociationService', () => {
  let service: ProductassociationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductassociationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
