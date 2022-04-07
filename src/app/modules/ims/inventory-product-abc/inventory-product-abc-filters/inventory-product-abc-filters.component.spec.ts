import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryProductAbcFiltersComponent } from './inventory-product-abc-filters.component';

describe('InventoryProductAbcFiltersComponent', () => {
  let component: InventoryProductAbcFiltersComponent;
  let fixture: ComponentFixture<InventoryProductAbcFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryProductAbcFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryProductAbcFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
