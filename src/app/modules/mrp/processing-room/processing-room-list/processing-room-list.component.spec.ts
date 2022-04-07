import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingRoomListComponent } from './processing-room-list.component';

describe('ProcessingRoomListComponent', () => {
  let component: ProcessingRoomListComponent;
  let fixture: ComponentFixture<ProcessingRoomListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessingRoomListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingRoomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
