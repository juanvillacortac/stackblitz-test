import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSupplierPerfilComponent } from './modal-supplier-perfil.component';

describe('ModalSupplierPerfilComponent', () => {
  let component: ModalSupplierPerfilComponent;
  let fixture: ComponentFixture<ModalSupplierPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSupplierPerfilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSupplierPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
