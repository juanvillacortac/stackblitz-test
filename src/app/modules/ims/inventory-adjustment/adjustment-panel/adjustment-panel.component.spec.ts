import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentPanelComponent } from './adjustment-panel.component';

describe('AdjustmentPanelComponent', () => {
  let component: AdjustmentPanelComponent;
  let fixture: ComponentFixture<AdjustmentPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustmentPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
