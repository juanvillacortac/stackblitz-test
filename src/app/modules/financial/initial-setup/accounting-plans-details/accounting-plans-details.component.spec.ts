import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingPlansDetailsComponent } from './accounting-plans-details.component';

describe('AccountingPlansDetailsComponent', () => {
  let component: AccountingPlansDetailsComponent;
  let fixture: ComponentFixture<AccountingPlansDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingPlansDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingPlansDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
