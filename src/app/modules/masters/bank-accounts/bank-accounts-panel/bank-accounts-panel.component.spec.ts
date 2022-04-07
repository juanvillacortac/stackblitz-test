import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountsPanelComponent } from './bank-accounts-panel.component';

describe('BankAccountsPanelComponent', () => {
  let component: BankAccountsPanelComponent;
  let fixture: ComponentFixture<BankAccountsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAccountsPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
