import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTransactionsLotModalComponent } from './lot-modal.component';

describe('TaxPlanModalComponent', () => {
  let component: SaleTransactionsLotModalComponent;
  let fixture: ComponentFixture<SaleTransactionsLotModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleTransactionsLotModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTransactionsLotModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
