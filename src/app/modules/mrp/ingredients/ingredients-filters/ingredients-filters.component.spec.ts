import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsFiltersComponent } from './ingredients-filters.component';

describe('IngredientsFiltersComponent', () => {
  let component: IngredientsFiltersComponent;
  let fixture: ComponentFixture<IngredientsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngredientsFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
