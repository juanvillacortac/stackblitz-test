import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailLoteComponent } from './product-detail-lote.component';

describe('ProductDetailLoteComponent', () => {
  let component: ProductDetailLoteComponent;
  let fixture: ComponentFixture<ProductDetailLoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailLoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
