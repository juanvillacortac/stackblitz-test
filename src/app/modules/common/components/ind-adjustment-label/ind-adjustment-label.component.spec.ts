import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndAdjustmentLabelComponent } from './ind-adjustment-label.component';

describe('IndAdjustmentLabelComponent', () => {
  let component: IndAdjustmentLabelComponent;
  let fixture: ComponentFixture<IndAdjustmentLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndAdjustmentLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndAdjustmentLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
