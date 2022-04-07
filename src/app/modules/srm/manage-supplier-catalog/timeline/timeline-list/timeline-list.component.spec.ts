import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineListComponent } from './timeline-list.component';

describe('TimelineListComponent', () => {
  let component: TimelineListComponent;
  let fixture: ComponentFixture<TimelineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
