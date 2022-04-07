import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReturnListComponent } from './product-return-list.component';

describe('ProductReturnListComponent', () => {
  let component: ProductReturnListComponent;
  let fixture: ComponentFixture<ProductReturnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductReturnListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductReturnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
