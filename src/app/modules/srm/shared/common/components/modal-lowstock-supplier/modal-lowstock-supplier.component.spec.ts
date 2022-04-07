import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLowstockSupplierComponent } from './modal-lowstock-supplier.component';

describe('ModalLowstockSupplierComponent', () => {
  let component: ModalLowstockSupplierComponent;
  let fixture: ComponentFixture<ModalLowstockSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalLowstockSupplierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLowstockSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
