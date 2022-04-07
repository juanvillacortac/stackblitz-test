import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayIndividualProgrammingFilterComponent } from './holiday-individual-programming-filter.component';

describe('HolidayIndividualProgrammingFilterComponent', () => {
  let component: HolidayIndividualProgrammingFilterComponent;
  let fixture: ComponentFixture<HolidayIndividualProgrammingFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayIndividualProgrammingFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayIndividualProgrammingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
