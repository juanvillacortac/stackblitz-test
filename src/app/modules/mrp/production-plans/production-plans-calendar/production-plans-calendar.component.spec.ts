import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPlansCalendarComponent } from './production-plans-calendar.component';

describe('ProductionPlansCalendarComponent', () => {
  let component: ProductionPlansCalendarComponent;
  let fixture: ComponentFixture<ProductionPlansCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionPlansCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionPlansCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
