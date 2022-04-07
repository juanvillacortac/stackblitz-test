import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomRecipesSearchComponent } from './room-recipes-search.component';

describe('RoomRecipesSearchComponent', () => {
  let component: RoomRecipesSearchComponent;
  let fixture: ComponentFixture<RoomRecipesSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomRecipesSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomRecipesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
