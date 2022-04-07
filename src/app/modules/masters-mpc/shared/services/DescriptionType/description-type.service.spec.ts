import { TestBed } from '@angular/core/testing';

import { DescriptionTypeService } from './description-type.service';

describe('DescriptionTypeService', () => {
  let service: DescriptionTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescriptionTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
