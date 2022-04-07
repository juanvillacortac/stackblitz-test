import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductorigintypeListComponent } from './productorigintype-list.component';

describe('ProductorigintypeListComponent', () => {
  let component: ProductorigintypeListComponent;
  let fixture: ComponentFixture<ProductorigintypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductorigintypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductorigintypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
