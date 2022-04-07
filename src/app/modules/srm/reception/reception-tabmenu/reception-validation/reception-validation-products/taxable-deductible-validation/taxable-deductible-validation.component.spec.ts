import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxableDeductibleValidationComponent } from './taxable-deductible-validation.component';

describe('TaxableDeductibleValidationComponent', () => {
  let component: TaxableDeductibleValidationComponent;
  let fixture: ComponentFixture<TaxableDeductibleValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxableDeductibleValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxableDeductibleValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
