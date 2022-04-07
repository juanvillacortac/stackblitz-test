import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChildReceptionComponent } from './modal-child-reception.component';

describe('ModalChildReceptionComponent', () => {
  let component: ModalChildReceptionComponent;
  let fixture: ComponentFixture<ModalChildReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalChildReceptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalChildReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
