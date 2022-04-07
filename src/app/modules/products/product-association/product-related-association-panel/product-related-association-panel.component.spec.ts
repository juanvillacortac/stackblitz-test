import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRelatedAssociationPanelComponent } from './product-related-association-panel.component';

describe('ProductRelatedAssociationPanelComponent', () => {
  let component: ProductRelatedAssociationPanelComponent;
  let fixture: ComponentFixture<ProductRelatedAssociationPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductRelatedAssociationPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRelatedAssociationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
