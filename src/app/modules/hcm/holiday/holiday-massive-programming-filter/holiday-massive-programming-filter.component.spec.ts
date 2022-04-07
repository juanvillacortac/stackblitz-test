import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayMassiveProgrammingFilterComponent } from './holiday-massive-programming-filter.component';

describe('HolidayMassiveProgrammingFilterComponent', () => {
  let component: HolidayMassiveProgrammingFilterComponent;
  let fixture: ComponentFixture<HolidayMassiveProgrammingFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayMassiveProgrammingFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayMassiveProgrammingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
