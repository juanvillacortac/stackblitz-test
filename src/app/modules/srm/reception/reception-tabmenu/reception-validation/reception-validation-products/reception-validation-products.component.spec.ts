import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionValidationProductsComponent } from './reception-validation-products.component';

describe('ReceptionValidationProductsComponent', () => {
  let component: ReceptionValidationProductsComponent;
  let fixture: ComponentFixture<ReceptionValidationProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionValidationProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionValidationProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
