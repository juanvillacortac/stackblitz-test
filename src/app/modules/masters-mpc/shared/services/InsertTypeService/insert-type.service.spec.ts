import { TestBed } from '@angular/core/testing';

import { InsertTypeService } from './insert-type.service';

describe('InsertTypeService', () => {
  let service: InsertTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsertTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
