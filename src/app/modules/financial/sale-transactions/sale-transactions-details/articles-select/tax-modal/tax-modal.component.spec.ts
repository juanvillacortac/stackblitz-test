import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTransactionsArticlesSelectModalComponent } from './tax-modal.component';

describe('TaxPlanModalComponent', () => {
  let component: SaleTransactionsArticlesSelectModalComponent;
  let fixture: ComponentFixture<SaleTransactionsArticlesSelectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleTransactionsArticlesSelectModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTransactionsArticlesSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
