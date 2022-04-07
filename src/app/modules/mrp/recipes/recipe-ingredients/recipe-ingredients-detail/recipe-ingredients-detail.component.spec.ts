import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeIngredientsDetailComponent } from './recipe-ingredients-detail.component';

describe('RecipeIngredientsDetailComponent', () => {
  let component: RecipeIngredientsDetailComponent;
  let fixture: ComponentFixture<RecipeIngredientsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeIngredientsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeIngredientsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
