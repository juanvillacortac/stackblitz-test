import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTransactionsArticlesSelectComponent } from './taxes-select.component';

describe('DetailArticleComponent', () => {
  let component: SaleTransactionsArticlesSelectComponent;
  let fixture: ComponentFixture<SaleTransactionsArticlesSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleTransactionsArticlesSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTransactionsArticlesSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
