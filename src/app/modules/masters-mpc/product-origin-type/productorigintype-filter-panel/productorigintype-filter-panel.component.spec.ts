import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductorigintypeFilterPanelComponent } from './productorigintype-filter-panel.component';

describe('ProductorigintypeFilterPanelComponent', () => {
  let component: ProductorigintypeFilterPanelComponent;
  let fixture: ComponentFixture<ProductorigintypeFilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductorigintypeFilterPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductorigintypeFilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
