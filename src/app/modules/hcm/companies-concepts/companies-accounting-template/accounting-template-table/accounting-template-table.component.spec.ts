import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingTemplateTableComponent } from './accounting-template-table.component';

describe('AccountingTemplateTableComponent', () => {
  let component: AccountingTemplateTableComponent;
  let fixture: ComponentFixture<AccountingTemplateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingTemplateTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingTemplateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
