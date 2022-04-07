import { TestBed } from '@angular/core/testing';

import { LogisticdataindicatorService } from './logisticdataindicator.service';

describe('LogisticdataindicatorService', () => {
  let service: LogisticdataindicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogisticdataindicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
