import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOfficesComparativesFiltersComponent } from './inventory-offices-comparatives-filters.component';

describe('InventoryOfficesComparativesFiltersComponent', () => {
  let component: InventoryOfficesComparativesFiltersComponent;
  let fixture: ComponentFixture<InventoryOfficesComparativesFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryOfficesComparativesFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryOfficesComparativesFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
