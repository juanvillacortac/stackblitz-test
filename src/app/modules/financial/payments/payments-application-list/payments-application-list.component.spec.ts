import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsApplicationListComponent } from './payments-application-list.component';

describe('PaymentsApplicationListComponent', () => {
  let component: PaymentsApplicationListComponent;
  let fixture: ComponentFixture<PaymentsApplicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsApplicationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
