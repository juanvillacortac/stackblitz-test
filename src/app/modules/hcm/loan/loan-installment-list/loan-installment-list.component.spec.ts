import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanInstallmentListComponent } from './loan-installment-list.component';

describe('LoanInstallmentListComponent', () => {
  let component: LoanInstallmentListComponent;
  let fixture: ComponentFixture<LoanInstallmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanInstallmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanInstallmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
