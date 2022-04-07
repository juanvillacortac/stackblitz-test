import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerAccountCategoryPanelComponent } from './ledger-account-category-panel.component';

describe('LedgerAccountCategoryPanelComponent', () => {
  let component: LedgerAccountCategoryPanelComponent;
  let fixture: ComponentFixture<LedgerAccountCategoryPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgerAccountCategoryPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerAccountCategoryPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
