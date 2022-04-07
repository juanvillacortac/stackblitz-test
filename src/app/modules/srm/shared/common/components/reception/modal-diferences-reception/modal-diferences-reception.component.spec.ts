import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDiferencesReceptionComponent } from './modal-diferences-reception.component';

describe('ModalDiferencesReceptionComponent', () => {
  let component: ModalDiferencesReceptionComponent;
  let fixture: ComponentFixture<ModalDiferencesReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDiferencesReceptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDiferencesReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
