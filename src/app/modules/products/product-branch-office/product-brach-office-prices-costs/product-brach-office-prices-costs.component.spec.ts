import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBrachOfficePricesCostsComponent } from './product-brach-office-prices-costs.component';

describe('ProductBrachOfficePricesCostsComponent', () => {
  let component: ProductBrachOfficePricesCostsComponent;
  let fixture: ComponentFixture<ProductBrachOfficePricesCostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBrachOfficePricesCostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBrachOfficePricesCostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
