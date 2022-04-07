import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsApplicationComponent } from './payments-application.component';

describe('PaymentsApplicationComponent', () => {
  let component: PaymentsApplicationComponent;
  let fixture: ComponentFixture<PaymentsApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
