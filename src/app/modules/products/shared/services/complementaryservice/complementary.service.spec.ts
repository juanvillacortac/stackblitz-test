import { TestBed } from '@angular/core/testing';

import { ComplementaryService } from './complementary.service';

describe('ComplementaryService', () => {
  let service: ComplementaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplementaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
