import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayMassiveProgrammingComponent } from './holiday-massive-programming.component';

describe('HolidayMassiveProgrammingComponent', () => {
  let component: HolidayMassiveProgrammingComponent;
  let fixture: ComponentFixture<HolidayMassiveProgrammingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayMassiveProgrammingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayMassiveProgrammingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
