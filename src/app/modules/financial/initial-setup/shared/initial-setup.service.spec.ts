import { TestBed } from '@angular/core/testing';

import { InitialSetupService } from './initial-setup.service';

describe('InitialSetupService', () => {
  let service: InitialSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitialSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
