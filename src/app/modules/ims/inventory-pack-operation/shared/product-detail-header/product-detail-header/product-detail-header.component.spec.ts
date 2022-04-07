import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailHeaderComponent } from './product-detail-header.component';

describe('ProductDetailHeaderComponent', () => {
  let component: ProductDetailHeaderComponent;
  let fixture: ComponentFixture<ProductDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
