import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeIngredientsListComponent } from './recipe-ingredients-list.component';

describe('RecipeIngredientsListComponent', () => {
  let component: RecipeIngredientsListComponent;
  let fixture: ComponentFixture<RecipeIngredientsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeIngredientsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeIngredientsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
