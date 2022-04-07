import { TestBed } from '@angular/core/testing';

import { ViewerDocumentsSupplierService } from './viewer-documents-supplier.service';

describe('ViewerDocumentsSupplierService', () => {
  let service: ViewerDocumentsSupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewerDocumentsSupplierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
