import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmentInvoiceHeaderComponent } from './consignment-invoice-header.component';

describe('ConsignmentInvoiceHeaderComponent', () => {
  let component: ConsignmentInvoiceHeaderComponent;
  let fixture: ComponentFixture<ConsignmentInvoiceHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsignmentInvoiceHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentInvoiceHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
