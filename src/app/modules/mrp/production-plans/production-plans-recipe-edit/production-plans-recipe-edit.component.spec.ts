import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPlansRecipeEditComponent } from './production-plans-recipe-edit.component';

describe('ProductionPlansRecipeEditComponent', () => {
  let component: ProductionPlansRecipeEditComponent;
  let fixture: ComponentFixture<ProductionPlansRecipeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionPlansRecipeEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionPlansRecipeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
