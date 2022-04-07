import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRateFiltersComponent } from './exchange-rate-filters.component';

describe('ExchangeRateFiltersComponent', () => {
  let component: ExchangeRateFiltersComponent;
  let fixture: ComponentFixture<ExchangeRateFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeRateFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRateFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
