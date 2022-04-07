import { TestBed } from '@angular/core/testing';

import { PlaceTypesServiceService } from './place-types-service.service';

describe('PlaceTypesServiceService', () => {
  let service: PlaceTypesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaceTypesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
