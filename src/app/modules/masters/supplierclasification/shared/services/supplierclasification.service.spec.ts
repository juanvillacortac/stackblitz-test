import { TestBed } from '@angular/core/testing';

import { SupplierclasificationService } from './supplierclasification.service';

describe('SupplierclasificationService', () => {
  let service: SupplierclasificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierclasificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
