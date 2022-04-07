import { TestBed } from '@angular/core/testing';

import { AttributeoptionService } from './attributeoption.service';

describe('AttributeoptionService', () => {
  let service: AttributeoptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeoptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
