import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSalesComponent } from './modal-sales.component';

describe('ModalSalesComponent', () => {
  let component: ModalSalesComponent;
  let fixture: ComponentFixture<ModalSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
