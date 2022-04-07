import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductcatalogFilterPanelComponent } from './productcatalog-filter-panel.component';

describe('ProductcatalogFilterPanelComponent', () => {
  let component: ProductcatalogFilterPanelComponent;
  let fixture: ComponentFixture<ProductcatalogFilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductcatalogFilterPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductcatalogFilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
