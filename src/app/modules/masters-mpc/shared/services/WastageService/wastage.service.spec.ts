import { TestBed } from '@angular/core/testing';

import { WastageService } from './wastage.service';

describe('WastageService', () => {
  let service: WastageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WastageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
