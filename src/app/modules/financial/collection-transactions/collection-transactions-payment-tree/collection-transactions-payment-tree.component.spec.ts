import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTransactionsPaymentTreeComponent } from './collection-transactions-payment-tree.component';

describe('CollectionTransactionsPaymentTreeComponent', () => {
  let component: CollectionTransactionsPaymentTreeComponent;
  let fixture: ComponentFixture<CollectionTransactionsPaymentTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionTransactionsPaymentTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTransactionsPaymentTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
