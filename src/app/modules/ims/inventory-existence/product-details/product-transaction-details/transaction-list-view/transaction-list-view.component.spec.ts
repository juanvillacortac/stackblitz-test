import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductExistenceTransactionListViewComponent } from './transaction-list-view.component';

describe('ProductExistenceTransactionListViewComponent', () => {
  let component: ProductExistenceTransactionListViewComponent;
  let fixture: ComponentFixture<ProductExistenceTransactionListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductExistenceTransactionListViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductExistenceTransactionListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
