import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductExistenceDetailsListComponent } from './product-details-list.component';

describe('ProductExistenceDetailsListComponent', () => {
  let component: ProductExistenceDetailsListComponent;
  let fixture: ComponentFixture<ProductExistenceDetailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductExistenceDetailsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductExistenceDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
