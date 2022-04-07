import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCountsCalendarComponent } from './inventory-counts-calendar.component';

describe('InventoryCountsCalendarComponent', () => {
  let component: InventoryCountsCalendarComponent;
  let fixture: ComponentFixture<InventoryCountsCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryCountsCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCountsCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
