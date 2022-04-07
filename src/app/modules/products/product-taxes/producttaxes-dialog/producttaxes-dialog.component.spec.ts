import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducttaxesDialogComponent } from './producttaxes-dialog.component';

describe('ProducttaxesDialogComponent', () => {
  let component: ProducttaxesDialogComponent;
  let fixture: ComponentFixture<ProducttaxesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProducttaxesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducttaxesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
