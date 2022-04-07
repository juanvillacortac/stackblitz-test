import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxRateFiltersComponent } from './tax-rate-filters.component';


describe('TaxRateFiltersComponent', () => {
  let component: TaxRateFiltersComponent;
  let fixture: ComponentFixture<TaxRateFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxRateFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxRateFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
