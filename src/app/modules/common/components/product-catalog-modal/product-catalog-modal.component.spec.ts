import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCatalogModalComponent } from './product-catalog-modal.component';

describe('ProductCatalogModalComponent', () => {
  let component: ProductCatalogModalComponent;
  let fixture: ComponentFixture<ProductCatalogModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCatalogModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCatalogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
