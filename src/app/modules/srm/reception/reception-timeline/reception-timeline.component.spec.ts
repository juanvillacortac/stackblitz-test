import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionTimelineComponent } from './reception-timeline.component';

describe('ReceptionTimelineComponent', () => {
  let component: ReceptionTimelineComponent;
  let fixture: ComponentFixture<ReceptionTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
