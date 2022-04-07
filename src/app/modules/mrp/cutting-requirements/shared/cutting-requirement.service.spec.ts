import { TestBed } from '@angular/core/testing';

import { CuttingRequirementService } from './cutting-requirement.service';

describe('CuttingRequirementService', () => {
  let service: CuttingRequirementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuttingRequirementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
