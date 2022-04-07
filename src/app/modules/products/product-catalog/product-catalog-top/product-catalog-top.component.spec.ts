import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCatalogTopComponent } from './product-catalog-top.component';

describe('ProductCatalogTopComponent', () => {
  let component: ProductCatalogTopComponent;
  let fixture: ComponentFixture<ProductCatalogTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCatalogTopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCatalogTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
