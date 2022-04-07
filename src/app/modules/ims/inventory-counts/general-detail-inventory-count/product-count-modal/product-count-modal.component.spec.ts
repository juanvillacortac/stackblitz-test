import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCountModalComponent } from './product-count-modal.component';

describe('ProductCountModalComponent', () => {
  let component: ProductCountModalComponent;
  let fixture: ComponentFixture<ProductCountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCountModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
