import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTransactionsListComponent } from './sale-transactions-list.component';

describe('SaleTransactionsListComponent', () => {
  let component: SaleTransactionsListComponent;
  let fixture: ComponentFixture<SaleTransactionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleTransactionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
