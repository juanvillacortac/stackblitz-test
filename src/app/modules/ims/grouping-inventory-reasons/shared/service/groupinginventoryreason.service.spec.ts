import { TestBed } from '@angular/core/testing';

import { GroupinginventoryreasonService } from './groupinginventoryreason.service';

describe('GroupinginventoryreasonService', () => {
  let service: GroupinginventoryreasonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupinginventoryreasonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
