import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderTotalResumeComponent } from './purchase-order-total-resume.component';

describe('PurchaseOrderTotalResumeComponent', () => {
  let component: PurchaseOrderTotalResumeComponent;
  let fixture: ComponentFixture<PurchaseOrderTotalResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderTotalResumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderTotalResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
