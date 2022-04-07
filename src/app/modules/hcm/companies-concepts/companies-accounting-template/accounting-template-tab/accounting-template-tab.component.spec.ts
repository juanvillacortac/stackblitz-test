import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingTemplateTabComponent } from './accounting-template-tab.component';

describe('AccountingTemplateTabComponent', () => {
  let component: AccountingTemplateTabComponent;
  let fixture: ComponentFixture<AccountingTemplateTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingTemplateTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingTemplateTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
