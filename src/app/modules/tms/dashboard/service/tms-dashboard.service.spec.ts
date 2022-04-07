import { TestBed } from '@angular/core/testing';

import { TmsDashboardService } from './tms-dashboard.service';

describe('TmsDashboardService', () => {
  let service: TmsDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmsDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
