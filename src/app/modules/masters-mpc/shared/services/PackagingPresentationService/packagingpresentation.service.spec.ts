import { TestBed } from '@angular/core/testing';

import { PackagingpresentationService } from './packagingpresentation.service';

describe('PackagingpresentationService', () => {
  let service: PackagingpresentationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackagingpresentationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
