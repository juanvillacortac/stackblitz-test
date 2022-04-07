import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepaymentDiscontinueComponent } from './repayment-discontinue.component';

describe('RepaymentDiscontinueComponent', () => {
  let component: RepaymentDiscontinueComponent;
  let fixture: ComponentFixture<RepaymentDiscontinueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepaymentDiscontinueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepaymentDiscontinueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
