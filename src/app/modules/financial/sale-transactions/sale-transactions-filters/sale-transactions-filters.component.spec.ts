import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTransactionsFiltersComponent } from './sale-transactions-filters.component';

describe('SaleTransactionsFiltersComponent', () => {
  let component: SaleTransactionsFiltersComponent;
  let fixture: ComponentFixture<SaleTransactionsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleTransactionsFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTransactionsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
