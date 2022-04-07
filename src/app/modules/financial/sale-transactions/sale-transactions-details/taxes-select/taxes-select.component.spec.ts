import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTransactionsTaxesSelectComponent } from './taxes-select.component';

describe('DetailArticleComponent', () => {
  let component: SaleTransactionsTaxesSelectComponent;
  let fixture: ComponentFixture<SaleTransactionsTaxesSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleTransactionsTaxesSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTransactionsTaxesSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
