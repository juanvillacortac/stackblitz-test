import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseRequestReportComponent } from './merchandise-request-report.component';

describe('MerchandiseRequestReportComponent', () => {
  let component: MerchandiseRequestReportComponent;
  let fixture: ComponentFixture<MerchandiseRequestReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseRequestReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseRequestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
