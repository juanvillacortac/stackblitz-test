import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelerikReportModalComponent } from './telerik-report-modal.component';

describe('TelerikReportModalComponent', () => {
  let component: TelerikReportModalComponent;
  let fixture: ComponentFixture<TelerikReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelerikReportModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelerikReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
