import { TestBed } from '@angular/core/testing';

import { StaticDataHelperService } from './static-data-helper.service';

describe('StaticDataService', () => {
  let service: StaticDataHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaticDataHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
