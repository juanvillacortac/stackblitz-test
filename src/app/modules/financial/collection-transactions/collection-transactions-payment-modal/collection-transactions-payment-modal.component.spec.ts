import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTransactionsPaymentModalComponent } from './collection-transactions-payment-modal.component';

describe('CollectionTransactionsPaymentModalComponent', () => {
  let component: CollectionTransactionsPaymentModalComponent;
  let fixture: ComponentFixture<CollectionTransactionsPaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionTransactionsPaymentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTransactionsPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
