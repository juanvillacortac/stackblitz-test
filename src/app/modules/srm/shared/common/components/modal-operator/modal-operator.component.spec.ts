import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOperatorComponent } from './modal-operator.component';

describe('ModalOperatorComponent', () => {
  let component: ModalOperatorComponent;
  let fixture: ComponentFixture<ModalOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalOperatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
