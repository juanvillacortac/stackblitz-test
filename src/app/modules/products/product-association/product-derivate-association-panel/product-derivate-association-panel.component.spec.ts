import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDerivateAssociationPanelComponent } from './product-derivate-association-panel.component';

describe('ProductDerivateAssociationPanelComponent', () => {
  let component: ProductDerivateAssociationPanelComponent;
  let fixture: ComponentFixture<ProductDerivateAssociationPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDerivateAssociationPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDerivateAssociationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
