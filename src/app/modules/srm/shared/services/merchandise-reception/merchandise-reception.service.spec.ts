import { TestBed } from '@angular/core/testing';

import { MerchandiseReceptionService } from './merchandise-reception.service';

describe('MerchandiseReceptionService', () => {
  let service: MerchandiseReceptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MerchandiseReceptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
