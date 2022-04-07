import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCountsListComponent } from './inventory-counts-list.component';

describe('InventoryCountsListComponent', () => {
  let component: InventoryCountsListComponent;
  let fixture: ComponentFixture<InventoryCountsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryCountsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCountsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
