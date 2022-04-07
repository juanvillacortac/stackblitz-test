import { TestBed } from '@angular/core/testing';

import { SomDashboardService } from './som-dashboard.service';

describe('SomDashboardService', () => {
  let service: SomDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SomDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
