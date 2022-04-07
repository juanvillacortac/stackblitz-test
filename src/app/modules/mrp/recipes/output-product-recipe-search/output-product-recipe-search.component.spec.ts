import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputProductRecipeSearchComponent } from './output-product-recipe-search.component';

describe('OutputProductRecipeSearchComponent', () => {
  let component: OutputProductRecipeSearchComponent;
  let fixture: ComponentFixture<OutputProductRecipeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputProductRecipeSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputProductRecipeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
