import { TestBed } from '@angular/core/testing';

import { DateHelperService } from './date-helper.service';

describe('DateHelper.Service.TsService', () => {
  let service: DateHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
