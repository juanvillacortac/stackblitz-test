import { TestBed } from '@angular/core/testing';

import { SerialportService } from './serialport.service';

describe('SerialportService', () => {
  let service: SerialportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerialportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
