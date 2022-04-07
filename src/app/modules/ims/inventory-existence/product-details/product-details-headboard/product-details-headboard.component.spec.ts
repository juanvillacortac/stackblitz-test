import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductExistenceDetailsHeadboardComponent } from './product-details-headboard.component';

describe('ProductExistenceDetailsHeadboardComponent', () => {
  let component: ProductExistenceDetailsHeadboardComponent;
  let fixture: ComponentFixture<ProductExistenceDetailsHeadboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductExistenceDetailsHeadboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductExistenceDetailsHeadboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
