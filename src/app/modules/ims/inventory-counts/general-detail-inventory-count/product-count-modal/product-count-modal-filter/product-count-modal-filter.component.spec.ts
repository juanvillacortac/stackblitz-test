import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCountModalFilterComponent } from './product-count-modal-filter.component';

describe('ProductCountModalFilterComponent', () => {
  let component: ProductCountModalFilterComponent;
  let fixture: ComponentFixture<ProductCountModalFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCountModalFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCountModalFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
