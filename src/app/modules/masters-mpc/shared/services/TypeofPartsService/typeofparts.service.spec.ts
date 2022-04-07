import { TestBed } from '@angular/core/testing';

import { TypeofpartsService } from './typeofparts.service';

describe('TypeofpartsService', () => {
  let service: TypeofpartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeofpartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
