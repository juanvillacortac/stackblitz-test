import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayTabComponent } from './holiday-tab.component';

describe('HolidayTabComponent', () => {
  let component: HolidayTabComponent;
  let fixture: ComponentFixture<HolidayTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
