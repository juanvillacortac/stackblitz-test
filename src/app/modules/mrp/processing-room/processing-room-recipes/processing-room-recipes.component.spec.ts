import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingRoomRecipesComponent } from './processing-room-recipes.component';

describe('ProcessingRoomRecipesComponent', () => {
  let component: ProcessingRoomRecipesComponent;
  let fixture: ComponentFixture<ProcessingRoomRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessingRoomRecipesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingRoomRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
