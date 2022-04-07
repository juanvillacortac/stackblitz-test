import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingRoomFiltersComponent } from './processing-room-filters.component';

describe('ProcessingRoomFiltersComponent', () => {
  let component: ProcessingRoomFiltersComponent;
  let fixture: ComponentFixture<ProcessingRoomFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessingRoomFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingRoomFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
