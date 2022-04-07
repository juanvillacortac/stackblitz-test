import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryValuedFiltersComponent } from './inventory-valued-filters.component';

describe('InventoryValuedFiltersComponent', () => {
  let component: InventoryValuedFiltersComponent;
  let fixture: ComponentFixture<InventoryValuedFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryValuedFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryValuedFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
