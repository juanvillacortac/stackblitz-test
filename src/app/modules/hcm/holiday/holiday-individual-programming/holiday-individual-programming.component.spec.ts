import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayIndividualProgrammingComponent } from './holiday-individual-programming.component';

describe('HolidayIndividualProgrammingComponent', () => {
  let component: HolidayIndividualProgrammingComponent;
  let fixture: ComponentFixture<HolidayIndividualProgrammingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayIndividualProgrammingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayIndividualProgrammingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
