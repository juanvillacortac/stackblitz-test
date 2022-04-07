import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityFiltersComponent } from './city-filters.component';

describe('CityFiltersComponent', () => {
  let component: CityFiltersComponent;
  let fixture: ComponentFixture<CityFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
