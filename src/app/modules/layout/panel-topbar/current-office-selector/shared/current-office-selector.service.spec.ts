import { TestBed } from '@angular/core/testing';

import { CurrentOfficeSelectorService } from './current-office-selector.service';

describe('CurrentOfficeSelectorService', () => {
  let service: CurrentOfficeSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentOfficeSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
