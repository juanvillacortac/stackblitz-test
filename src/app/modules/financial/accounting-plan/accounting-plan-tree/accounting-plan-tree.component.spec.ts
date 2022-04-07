import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingPlanTreeComponent } from './accounting-plan-tree.component';

describe('AccountingPlanTreeComponent', () => {
  let component: AccountingPlanTreeComponent;
  let fixture: ComponentFixture<AccountingPlanTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingPlanTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingPlanTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
