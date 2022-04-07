import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRotationComponent } from './product-rotation.component';

describe('ProductRotationComponent', () => {
  let component: ProductRotationComponent;
  let fixture: ComponentFixture<ProductRotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductRotationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
