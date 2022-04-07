import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsDocumentSelectModalComponent } from './payments-document-select-modal.component';

describe('PaymentsDocumentSelectModalComponent', () => {
  let component: PaymentsDocumentSelectModalComponent;
  let fixture: ComponentFixture<PaymentsDocumentSelectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsDocumentSelectModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsDocumentSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
