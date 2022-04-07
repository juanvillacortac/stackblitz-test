import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTransactionAcountModalComponent } from './sale-transaction-acount-modal.component';

describe('SaleTransactionAcountModalComponent', () => {
  let component: SaleTransactionAcountModalComponent;
  let fixture: ComponentFixture<SaleTransactionAcountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleTransactionAcountModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTransactionAcountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
