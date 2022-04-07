import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTransactionsTaxesSelectModalComponent } from './tax-modal.component';

describe('TaxPlanModalComponent', () => {
  let component: SaleTransactionsTaxesSelectModalComponent;
  let fixture: ComponentFixture<SaleTransactionsTaxesSelectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleTransactionsTaxesSelectModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTransactionsTaxesSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
