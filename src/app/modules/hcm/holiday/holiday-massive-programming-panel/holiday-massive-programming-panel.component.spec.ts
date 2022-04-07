import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayMassiveProgrammingPanelComponent } from './holiday-massive-programming-panel.component';

describe('HolidayMassiveProgrammingPanelComponent', () => {
  let component: HolidayMassiveProgrammingPanelComponent;
  let fixture: ComponentFixture<HolidayMassiveProgrammingPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayMassiveProgrammingPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayMassiveProgrammingPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
