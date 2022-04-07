import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanInstallmentPanelComponent } from './loan-installment-panel.component';

describe('LoanInstallmentPanelComponent', () => {
  let component: LoanInstallmentPanelComponent;
  let fixture: ComponentFixture<LoanInstallmentPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanInstallmentPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanInstallmentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
