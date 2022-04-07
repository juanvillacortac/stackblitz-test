import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsTreeComponent } from './payments-tree.component';

describe('PaymentsTreeComponent', () => {
  let component: PaymentsTreeComponent;
  let fixture: ComponentFixture<PaymentsTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
