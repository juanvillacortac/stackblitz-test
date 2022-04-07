import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTransactionsClientModalComponent } from './client-modal.component';

describe('TaxPlanModalComponent', () => {
  let component: SaleTransactionsClientModalComponent;
  let fixture: ComponentFixture<SaleTransactionsClientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleTransactionsClientModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTransactionsClientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
