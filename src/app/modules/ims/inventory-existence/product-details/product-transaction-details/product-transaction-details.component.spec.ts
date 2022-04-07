import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductExistenceTransactionDetailsComponent } from './product-existence-transaction-details.component';

describe('ProductExistenceTransactionDetailsComponent', () => {
  let component: ProductExistenceTransactionDetailsComponent;
  let fixture: ComponentFixture<ProductExistenceTransactionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductExistenceTransactionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductExistenceTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
