import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerAccountCategoryListComponent } from './ledger-account-category-list.component';

describe('LedgerAccountCategoryListComponent', () => {
  let component: LedgerAccountCategoryListComponent;
  let fixture: ComponentFixture<LedgerAccountCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgerAccountCategoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerAccountCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
