import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingPlanDetailsComponent } from './accounting-plan-details.component';

describe('AccountingPlanDetailsComponent', () => {
  let component: AccountingPlanDetailsComponent;
  let fixture: ComponentFixture<AccountingPlanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingPlanDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
