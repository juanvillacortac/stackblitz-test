import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBranchOfficeTabpanelComponent } from './product-branch-office-tabpanel.component';

describe('ProductBranchOfficeTabpanelComponent', () => {
  let component: ProductBranchOfficeTabpanelComponent;
  let fixture: ComponentFixture<ProductBranchOfficeTabpanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBranchOfficeTabpanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBranchOfficeTabpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
