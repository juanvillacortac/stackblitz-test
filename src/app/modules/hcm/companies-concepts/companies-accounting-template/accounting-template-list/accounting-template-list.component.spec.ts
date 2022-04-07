import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingTemplateListComponent } from './accounting-template-list.component';

describe('AccountingTemplateListComponent', () => {
  let component: AccountingTemplateListComponent;
  let fixture: ComponentFixture<AccountingTemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingTemplateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
