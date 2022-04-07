import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOrderPointComponent } from './modal-order-point.component';

describe('ModalOrderPointComponent', () => {
  let component: ModalOrderPointComponent;
  let fixture: ComponentFixture<ModalOrderPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalOrderPointComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOrderPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
