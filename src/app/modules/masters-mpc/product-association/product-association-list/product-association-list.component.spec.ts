import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAssociationListComponent } from './product-association-list.component';

describe('ProductAssociationListComponent', () => {
  let component: ProductAssociationListComponent;
  let fixture: ComponentFixture<ProductAssociationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAssociationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAssociationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
