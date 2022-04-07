import { TestBed } from '@angular/core/testing';

import { DashboardPositionsService } from './dashboard-positions.service';

describe('DashboardPositionsService', () => {
  let service: DashboardPositionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardPositionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
