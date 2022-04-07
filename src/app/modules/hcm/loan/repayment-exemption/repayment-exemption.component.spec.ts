import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepaymentExemptionComponent } from './repayment-exemption.component';

describe('RepaymentExemptionComponent', () => {
  let component: RepaymentExemptionComponent;
  let fixture: ComponentFixture<RepaymentExemptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepaymentExemptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepaymentExemptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
