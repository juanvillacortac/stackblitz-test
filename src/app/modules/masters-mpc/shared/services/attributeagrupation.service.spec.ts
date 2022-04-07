import { TestBed } from '@angular/core/testing';

import { AttributeagrupationService } from './attributeagrupation.service';

describe('AttributeagrupationService', () => {
  let service: AttributeagrupationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeagrupationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
