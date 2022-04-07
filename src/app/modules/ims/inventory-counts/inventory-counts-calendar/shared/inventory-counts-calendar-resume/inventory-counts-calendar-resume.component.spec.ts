import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCountsCalendarResumeComponent } from './inventory-counts-calendar-resume.component';

describe('InventoryCountsCalendarResumeComponent', () => {
  let component: InventoryCountsCalendarResumeComponent;
  let fixture: ComponentFixture<InventoryCountsCalendarResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryCountsCalendarResumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCountsCalendarResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
