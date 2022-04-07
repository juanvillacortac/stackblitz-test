import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRotationFiltersComponent } from './product-rotation-filters.component';

describe('ProductRotationFiltersComponent', () => {
  let component: ProductRotationFiltersComponent;
  let fixture: ComponentFixture<ProductRotationFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductRotationFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRotationFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
