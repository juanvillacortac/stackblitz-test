import { TestBed } from '@angular/core/testing';

import { ValidationProductService } from './validation-product.service';

describe('ValidationProductService', () => {
  let service: ValidationProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
