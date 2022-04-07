import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightInstrumentFiltersComponent } from './weight-instrument-filters.component';

describe('WeightInstrumentFiltersComponent', () => {
  let component: WeightInstrumentFiltersComponent;
  let fixture: ComponentFixture<WeightInstrumentFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeightInstrumentFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightInstrumentFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
