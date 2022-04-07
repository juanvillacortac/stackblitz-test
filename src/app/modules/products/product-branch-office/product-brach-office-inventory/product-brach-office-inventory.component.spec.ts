import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBrachOfficeInventoryComponent } from './product-brach-office-inventory.component';

describe('ProductBrachOfficeInventoryComponent', () => {
  let component: ProductBrachOfficeInventoryComponent;
  let fixture: ComponentFixture<ProductBrachOfficeInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBrachOfficeInventoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBrachOfficeInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
