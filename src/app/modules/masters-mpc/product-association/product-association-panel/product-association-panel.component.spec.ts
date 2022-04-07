import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAssociationPanelComponent } from './product-association-panel.component';

describe('ProductAssociationPanelComponent', () => {
  let component: ProductAssociationPanelComponent;
  let fixture: ComponentFixture<ProductAssociationPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAssociationPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAssociationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
