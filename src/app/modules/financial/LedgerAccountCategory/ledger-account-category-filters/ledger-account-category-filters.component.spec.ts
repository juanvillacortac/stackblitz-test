import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerAccountCategoryFiltersComponent } from './ledger-account-category-filters.component';

describe('LedgerAccountCategoryFiltersComponent', () => {
  let component: LedgerAccountCategoryFiltersComponent;
  let fixture: ComponentFixture<LedgerAccountCategoryFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgerAccountCategoryFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerAccountCategoryFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
