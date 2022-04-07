import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingTemplatePanelComponent } from './accounting-template-panel.component';

describe('AccountingTemplatePanelComponent', () => {
  let component: AccountingTemplatePanelComponent;
  let fixture: ComponentFixture<AccountingTemplatePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingTemplatePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingTemplatePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
