import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseRequestCalendarItemComponent } from './merchandise-request-calendar-item.component';

describe('MerchandiseRequestCalendarItemComponent', () => {
  let component: MerchandiseRequestCalendarItemComponent;
  let fixture: ComponentFixture<MerchandiseRequestCalendarItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseRequestCalendarItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseRequestCalendarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
