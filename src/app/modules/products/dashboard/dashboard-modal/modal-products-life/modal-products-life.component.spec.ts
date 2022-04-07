import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProductsLifeComponent } from './modal-products-life.component';

describe('ModalProductsLifeComponent', () => {
  let component: ModalProductsLifeComponent;
  let fixture: ComponentFixture<ModalProductsLifeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalProductsLifeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProductsLifeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
