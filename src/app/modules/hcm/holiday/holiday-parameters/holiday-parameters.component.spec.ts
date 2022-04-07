import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayParametersComponent } from './holiday-parameters.component';

describe('HolidayParametersComponent', () => {
  let component: HolidayParametersComponent;
  let fixture: ComponentFixture<HolidayParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayParametersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
