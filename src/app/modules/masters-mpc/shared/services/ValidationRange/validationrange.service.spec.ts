import { TestBed } from '@angular/core/testing';

import { ValidationrangeService } from './validationrange.service';

describe('ValidationrangeService', () => {
  let service: ValidationrangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationrangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
