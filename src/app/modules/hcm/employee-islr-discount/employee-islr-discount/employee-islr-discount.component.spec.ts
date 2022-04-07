import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeIslrDiscountComponent } from './employee-islr-discount.component';

describe('EmployeeIslrDiscountComponent', () => {
  let component: EmployeeIslrDiscountComponent;
  let fixture: ComponentFixture<EmployeeIslrDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeIslrDiscountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeIslrDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
