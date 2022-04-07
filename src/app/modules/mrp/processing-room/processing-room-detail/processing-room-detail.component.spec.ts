import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingRoomDetailComponent } from './processing-room-detail.component';

describe('ProcessingRoomDetailComponent', () => {
  let component: ProcessingRoomDetailComponent;
  let fixture: ComponentFixture<ProcessingRoomDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessingRoomDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingRoomDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
