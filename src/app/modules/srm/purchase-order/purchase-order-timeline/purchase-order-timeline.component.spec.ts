import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderTimelineComponent } from './purchase-order-timeline.component';

describe('PurchaseOrderTimelineComponent', () => {
  let component: PurchaseOrderTimelineComponent;
  let fixture: ComponentFixture<PurchaseOrderTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
