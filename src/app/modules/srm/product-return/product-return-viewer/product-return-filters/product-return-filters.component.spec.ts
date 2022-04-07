import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReturnFiltersComponent } from './product-return-filters.component';

describe('ProductReturnFiltersComponent', () => {
  let component: ProductReturnFiltersComponent;
  let fixture: ComponentFixture<ProductReturnFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductReturnFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductReturnFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
