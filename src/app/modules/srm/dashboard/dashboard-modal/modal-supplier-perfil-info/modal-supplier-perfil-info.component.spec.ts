import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSupplierPerfilInfoComponent } from './modal-supplier-perfil-info.component';

describe('ModalSupplierPerfilInfoComponent', () => {
  let component: ModalSupplierPerfilInfoComponent;
  let fixture: ComponentFixture<ModalSupplierPerfilInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSupplierPerfilInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSupplierPerfilInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
