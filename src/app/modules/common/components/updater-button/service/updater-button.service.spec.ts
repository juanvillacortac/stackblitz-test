import { TestBed } from '@angular/core/testing';

import { UpdaterButtonService } from './updater-button.service';

describe('UpdaterButtonService', () => {
  let service: UpdaterButtonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdaterButtonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
