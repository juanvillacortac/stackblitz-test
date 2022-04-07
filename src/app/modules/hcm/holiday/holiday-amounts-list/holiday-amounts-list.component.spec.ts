import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayAmountsListComponent } from './holiday-amounts-list.component';

describe('HolidayAmountsListComponent', () => {
  let component: HolidayAmountsListComponent;
  let fixture: ComponentFixture<HolidayAmountsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayAmountsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayAmountsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
