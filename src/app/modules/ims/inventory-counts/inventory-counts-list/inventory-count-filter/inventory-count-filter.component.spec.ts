import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCountFilterComponent } from './inventory-count-filter.component';

describe('InventoryCountFilterComponent', () => {
  let component: InventoryCountFilterComponent;
  let fixture: ComponentFixture<InventoryCountFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryCountFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCountFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
