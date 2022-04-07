import { TestBed } from '@angular/core/testing';

import { CommonMastersService } from './common-masters.service';

describe('CommonService', () => {
  let service: CommonMastersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
