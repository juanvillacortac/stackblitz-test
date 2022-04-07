import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConsignmentinvoiceComponent } from './modal-consignmentinvoice.component';

describe('ModalConsignmentinvoiceComponent', () => {
  let component: ModalConsignmentinvoiceComponent;
  let fixture: ComponentFixture<ModalConsignmentinvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalConsignmentinvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConsignmentinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
