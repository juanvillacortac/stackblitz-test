import { TestBed } from '@angular/core/testing';

import { GtintypeService } from './gtintype.service';

describe('GtintypeService', () => {
  let service: GtintypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GtintypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
