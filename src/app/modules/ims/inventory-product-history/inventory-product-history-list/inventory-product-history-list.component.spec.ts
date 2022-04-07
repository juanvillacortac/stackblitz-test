import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryProductHistoryListComponent } from './inventory-product-history-list.component';

describe('InventoryProductHistoryListComponent', () => {
  let component: InventoryProductHistoryListComponent;
  let fixture: ComponentFixture<InventoryProductHistoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryProductHistoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryProductHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
