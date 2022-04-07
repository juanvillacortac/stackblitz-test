import { TestBed } from '@angular/core/testing';

import { OperationmastersService } from './operationmasters.service';

describe('OperationmastersService', () => {
  let service: OperationmastersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationmastersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
