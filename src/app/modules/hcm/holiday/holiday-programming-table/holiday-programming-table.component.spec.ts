import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayProgrammingTableComponent } from './holiday-programming-table.component';

describe('HolidayProgrammingTableComponent', () => {
  let component: HolidayProgrammingTableComponent;
  let fixture: ComponentFixture<HolidayProgrammingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayProgrammingTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayProgrammingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
