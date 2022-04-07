import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchMrpRecipesComponent } from './search-mrp-recipes.component';


describe('SearchMrpIngredientsComponent', () => {
  let component: SearchMrpRecipesComponent;
  let fixture: ComponentFixture<SearchMrpRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchMrpRecipesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMrpRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
