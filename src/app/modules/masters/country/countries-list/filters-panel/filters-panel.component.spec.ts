import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersPanelComponentCountries } from './filters-panel.component';


describe('FiltersPanelComponentCountries', () => {
  let component: FiltersPanelComponentCountries;
  let fixture: ComponentFixture<FiltersPanelComponentCountries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiltersPanelComponentCountries ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersPanelComponentCountries);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
