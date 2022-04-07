import { TestBed } from '@angular/core/testing';

import { ConsigmentinvoiceService } from './consigmentinvoice.service';

describe('ConsigmentinvoiceService', () => {
  let service: ConsigmentinvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsigmentinvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
