import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPanelPricesComponent } from './product-panel-prices.component';

describe('ProductPanelPricesComponent', () => {
  let component: ProductPanelPricesComponent;
  let fixture: ComponentFixture<ProductPanelPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductPanelPricesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPanelPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
