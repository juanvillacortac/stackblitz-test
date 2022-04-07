import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepaymentListComponent } from './repayment-list.component';

describe('RepaymentListComponent', () => {
  let component: RepaymentListComponent;
  let fixture: ComponentFixture<RepaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepaymentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
