import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseRequestCalendarResumeComponent } from './merchandise-request-calendar-resume.component';

describe('MerchandiseRequestCalendarResumeComponent', () => {
  let component: MerchandiseRequestCalendarResumeComponent;
  let fixture: ComponentFixture<MerchandiseRequestCalendarResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseRequestCalendarResumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseRequestCalendarResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
