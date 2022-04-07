import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryExistenceFiltersPanelComponent } from './inventory-existence-filters-panel.component';

describe('InventoryExistenceFiltersPanelComponent', () => {
  let component: InventoryExistenceFiltersPanelComponent;
  let fixture: ComponentFixture<InventoryExistenceFiltersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryExistenceFiltersPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryExistenceFiltersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
