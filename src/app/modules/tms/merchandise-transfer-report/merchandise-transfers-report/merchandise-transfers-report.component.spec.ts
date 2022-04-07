import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseTransfersReportComponent } from './merchandise-transfers-report.component';

describe('MerchandiseTransfersReportComponent', () => {
  let component: MerchandiseTransfersReportComponent;
  let fixture: ComponentFixture<MerchandiseTransfersReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseTransfersReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseTransfersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
