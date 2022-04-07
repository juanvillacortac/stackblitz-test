import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxableDeductibleProductComponent } from './taxable-deductible-product.component';

describe('TaxableDeductibleProductComponent', () => {
  let component: TaxableDeductibleProductComponent;
  let fixture: ComponentFixture<TaxableDeductibleProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxableDeductibleProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxableDeductibleProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
