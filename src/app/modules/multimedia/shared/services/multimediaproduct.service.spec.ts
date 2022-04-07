import { TestBed } from '@angular/core/testing';

import { MultimediaproductService } from './multimediaproduct.service';

describe('MultimediaproductService', () => {
  let service: MultimediaproductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultimediaproductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
