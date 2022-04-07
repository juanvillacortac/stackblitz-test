import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepaymentPanelComponent } from './repayment-panel.component';

describe('RepaymentPanelComponent', () => {
  let component: RepaymentPanelComponent;
  let fixture: ComponentFixture<RepaymentPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepaymentPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepaymentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
