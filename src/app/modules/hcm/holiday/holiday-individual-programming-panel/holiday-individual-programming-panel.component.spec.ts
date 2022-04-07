import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayIndividualProgrammingPanelComponent } from './holiday-individual-programming-panel.component';

describe('HolidayIndividualProgrammingPanelComponent', () => {
  let component: HolidayIndividualProgrammingPanelComponent;
  let fixture: ComponentFixture<HolidayIndividualProgrammingPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayIndividualProgrammingPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayIndividualProgrammingPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
