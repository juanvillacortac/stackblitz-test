import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAssociationFilterComponent } from './product-association-filter.component';

describe('ProductAssociationFilterComponent', () => {
  let component: ProductAssociationFilterComponent;
  let fixture: ComponentFixture<ProductAssociationFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAssociationFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAssociationFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
