import { TestBed } from '@angular/core/testing';

import { DerivateRoomService } from './derivate-room.service';

describe('RawMaterialService', () => {
  let service: DerivateRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DerivateRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
