import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTransactionsDetailsComponent } from './sale-transactions-details.component';

describe('SaleTransactionsDetailsComponent', () => {
  let component: SaleTransactionsDetailsComponent;
  let fixture: ComponentFixture<SaleTransactionsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleTransactionsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTransactionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
