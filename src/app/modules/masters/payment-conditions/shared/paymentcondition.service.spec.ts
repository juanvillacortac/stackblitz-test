import { TestBed } from '@angular/core/testing';

import { PaymentconditionService } from './paymentcondition.service';

describe('PaymentconditionService', () => {
  let service: PaymentconditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentconditionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
