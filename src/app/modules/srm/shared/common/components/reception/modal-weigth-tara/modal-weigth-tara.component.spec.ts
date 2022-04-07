import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWeigthTaraComponent } from './modal-weigth-tara.component';

describe('ModalWeigthTaraComponent', () => {
  let component: ModalWeigthTaraComponent;
  let fixture: ComponentFixture<ModalWeigthTaraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalWeigthTaraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalWeigthTaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
