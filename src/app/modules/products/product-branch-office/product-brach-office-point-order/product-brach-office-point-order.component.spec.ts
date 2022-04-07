import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBrachOfficePointOrderComponent } from './product-brach-office-point-order.component';

describe('ProductBrachOfficePointOrderComponent', () => {
  let component: ProductBrachOfficePointOrderComponent;
  let fixture: ComponentFixture<ProductBrachOfficePointOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBrachOfficePointOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBrachOfficePointOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
