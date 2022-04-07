import { TestBed } from '@angular/core/testing';

import { UseofpackagingService } from './useofpackaging.service';

describe('UseofpackagingService', () => {
  let service: UseofpackagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UseofpackagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
