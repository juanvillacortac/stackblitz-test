import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeIngredientRecalculateListComponent } from './recipe-ingredient-recalculate-list.component';

describe('RecipeIngredientRecalculateListComponent', () => {
  let component: RecipeIngredientRecalculateListComponent;
  let fixture: ComponentFixture<RecipeIngredientRecalculateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeIngredientRecalculateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeIngredientRecalculateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
