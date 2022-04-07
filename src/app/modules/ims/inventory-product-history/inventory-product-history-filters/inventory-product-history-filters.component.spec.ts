import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryProductHistoryFiltersComponent } from './inventory-product-history-filters.component';

describe('InventoryProductHistoryFiltersComponent', () => {
  let component: InventoryProductHistoryFiltersComponent;
  let fixture: ComponentFixture<InventoryProductHistoryFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryProductHistoryFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryProductHistoryFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
