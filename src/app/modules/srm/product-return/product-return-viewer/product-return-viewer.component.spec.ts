import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReturnViewerComponent } from './product-return-viewer.component';

describe('ProductReturnViewerComponent', () => {
  let component: ProductReturnViewerComponent;
  let fixture: ComponentFixture<ProductReturnViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductReturnViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductReturnViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
