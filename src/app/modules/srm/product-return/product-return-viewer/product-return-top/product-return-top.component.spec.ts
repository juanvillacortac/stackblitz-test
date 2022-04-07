import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReturnTopComponent } from './product-return-top.component';

describe('ProductReturnTopComponent', () => {
  let component: ProductReturnTopComponent;
  let fixture: ComponentFixture<ProductReturnTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductReturnTopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductReturnTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
