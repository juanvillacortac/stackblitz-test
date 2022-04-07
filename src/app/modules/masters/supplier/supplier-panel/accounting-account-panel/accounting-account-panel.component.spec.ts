import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingAccountSuppliersPanelComponent } from './accounting-account-panel.component';

describe('ArticleClassificationPanelComponent', () => {
  let component: AccountingAccountSuppliersPanelComponent;
  let fixture: ComponentFixture<AccountingAccountSuppliersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingAccountSuppliersPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingAccountSuppliersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
