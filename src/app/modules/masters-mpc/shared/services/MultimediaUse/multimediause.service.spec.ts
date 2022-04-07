import { TestBed } from '@angular/core/testing';

import { MultimediauseService } from './multimediause.service';

describe('MultimediauseService', () => {
  let service: MultimediauseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultimediauseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
