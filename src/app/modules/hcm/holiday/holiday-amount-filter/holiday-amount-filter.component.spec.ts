import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayAmountFilterComponent } from './holiday-amount-filter.component';

describe('HolidayAmountFilterComponent', () => {
  let component: HolidayAmountFilterComponent;
  let fixture: ComponentFixture<HolidayAmountFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayAmountFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayAmountFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
