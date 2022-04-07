import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceTimelineComponent } from './invoice-timeline.component';

describe('InvoiceTimelineComponent', () => {
  let component: InvoiceTimelineComponent;
  let fixture: ComponentFixture<InvoiceTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
