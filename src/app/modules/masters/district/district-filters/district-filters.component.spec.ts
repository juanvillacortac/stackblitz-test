import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DistrictFiltersComponent } from './district-filters.component';

describe('DistrictFiltersComponent', () => {
  let component: DistrictFiltersComponent;
  let fixture: ComponentFixture<DistrictFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistrictFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
