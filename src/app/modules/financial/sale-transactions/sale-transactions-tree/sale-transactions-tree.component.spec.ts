import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTransactionsTreeComponent } from './sale-transactions-tree.component';

describe('SaleTransactionsTreeComponent', () => {
  let component: SaleTransactionsTreeComponent;
  let fixture: ComponentFixture<SaleTransactionsTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleTransactionsTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTransactionsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
