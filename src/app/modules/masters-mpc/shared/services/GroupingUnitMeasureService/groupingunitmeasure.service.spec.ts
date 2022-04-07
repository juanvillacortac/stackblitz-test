import { TestBed } from '@angular/core/testing';

import { GroupingunitmeasureService } from './groupingunitmeasure.service';

describe('GroupingunitmeasureService', () => {
  let service: GroupingunitmeasureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupingunitmeasureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
