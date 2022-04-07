import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusAdjustmentLabelComponent } from './status-adjustment-label.component';

describe('StatusAdjustmentLabelComponent', () => {
  let component: StatusAdjustmentLabelComponent;
  let fixture: ComponentFixture<StatusAdjustmentLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusAdjustmentLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusAdjustmentLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
