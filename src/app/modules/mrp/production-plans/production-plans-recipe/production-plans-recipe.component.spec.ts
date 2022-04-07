import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPlansRecipeComponent } from './production-plans-recipe.component';

describe('ProductionPlansRecipeComponent', () => {
  let component: ProductionPlansRecipeComponent;
  let fixture: ComponentFixture<ProductionPlansRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionPlansRecipeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionPlansRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
