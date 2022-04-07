import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComplementaryComponent } from './product-complementary.component';

describe('ProductComplementaryComponent', () => {
  let component: ProductComplementaryComponent;
  let fixture: ComponentFixture<ProductComplementaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductComplementaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComplementaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
