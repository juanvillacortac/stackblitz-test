import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxFiltersComponent } from './tax-filters.component';

describe('TaxFiltersComponent', () => {
  let component: TaxFiltersComponent;
  let fixture: ComponentFixture<TaxFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
