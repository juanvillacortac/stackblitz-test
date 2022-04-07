import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBrachOfficeIndicatorsComponent } from './product-brach-office-indicators.component';

describe('ProductBrachOfficeIndicatorsComponent', () => {
  let component: ProductBrachOfficeIndicatorsComponent;
  let fixture: ComponentFixture<ProductBrachOfficeIndicatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBrachOfficeIndicatorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBrachOfficeIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
