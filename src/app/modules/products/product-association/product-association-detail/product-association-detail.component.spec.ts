import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAssociationDetailComponent } from './product-association-detail.component';

describe('ProductAssociationDetailComponent', () => {
  let component: ProductAssociationDetailComponent;
  let fixture: ComponentFixture<ProductAssociationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAssociationDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAssociationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
