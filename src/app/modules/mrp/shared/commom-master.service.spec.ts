import { TestBed } from '@angular/core/testing';

import { CommomMasterService } from './commom-master.service';

describe('CommomMasterService', () => {
  let service: CommomMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommomMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
