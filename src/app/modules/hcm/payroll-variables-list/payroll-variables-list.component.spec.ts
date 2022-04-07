import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollVariablesListComponent } from './payroll-variables-list.component';

describe('PayrollVariablesListComponent', () => {
  let component: PayrollVariablesListComponent;
  let fixture: ComponentFixture<PayrollVariablesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollVariablesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollVariablesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
