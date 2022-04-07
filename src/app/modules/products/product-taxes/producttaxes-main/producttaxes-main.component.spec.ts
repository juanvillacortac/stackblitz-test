import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducttaxesMainComponent } from './producttaxes-main.component';

describe('ProducttaxesMainComponent', () => {
  let component: ProducttaxesMainComponent;
  let fixture: ComponentFixture<ProducttaxesMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProducttaxesMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducttaxesMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
