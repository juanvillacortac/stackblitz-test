import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComponentAssociationPanelComponent } from './product-component-association-panel.component';

describe('ProductComponentAssociationPanelComponent', () => {
  let component: ProductComponentAssociationPanelComponent;
  let fixture: ComponentFixture<ProductComponentAssociationPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductComponentAssociationPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponentAssociationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
