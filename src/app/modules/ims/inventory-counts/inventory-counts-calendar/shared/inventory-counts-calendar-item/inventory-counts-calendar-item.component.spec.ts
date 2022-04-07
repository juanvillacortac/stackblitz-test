import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCountsCalendarItemComponent } from './inventory-counts-calendar-item.component';

describe('InventoryCountsCalendarItemComponent', () => {
  let component: InventoryCountsCalendarItemComponent;
  let fixture: ComponentFixture<InventoryCountsCalendarItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryCountsCalendarItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCountsCalendarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
