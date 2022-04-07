import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBranchOfficeValidationFactorComponent } from './product-branch-office-validation-factor.component';

describe('ProductBranchOfficeValidationFactorComponent', () => {
  let component: ProductBranchOfficeValidationFactorComponent;
  let fixture: ComponentFixture<ProductBranchOfficeValidationFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBranchOfficeValidationFactorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBranchOfficeValidationFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
