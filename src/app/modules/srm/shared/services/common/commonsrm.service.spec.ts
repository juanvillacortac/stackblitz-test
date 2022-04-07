import { TestBed } from '@angular/core/testing';

import { CommonsrmService } from './commonsrm.service';

describe('CommonsrmService', () => {
  let service: CommonsrmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonsrmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
