import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductExistenceTransactionGridViewComponent } from './transaction-grid-view.component';

describe('ProductExistenceTransactionGridViewComponent', () => {
  let component: ProductExistenceTransactionGridViewComponent;
  let fixture: ComponentFixture<ProductExistenceTransactionGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductExistenceTransactionGridViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductExistenceTransactionGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
