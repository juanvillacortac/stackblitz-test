import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerViewerComponent } from './timer-viewer.component';

describe('TimerViewerComponent', () => {
  let component: TimerViewerComponent;
  let fixture: ComponentFixture<TimerViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimerViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
