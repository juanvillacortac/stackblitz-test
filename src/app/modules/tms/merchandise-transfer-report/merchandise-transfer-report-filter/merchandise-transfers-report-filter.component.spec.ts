import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseTransfersReportFilterComponent } from './merchandise-transfers-report-filter.component';

describe('MerchandiseTransfersReportFilterComponent', () => {
  let component: MerchandiseTransfersReportFilterComponent;
  let fixture: ComponentFixture<MerchandiseTransfersReportFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseTransfersReportFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseTransfersReportFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
