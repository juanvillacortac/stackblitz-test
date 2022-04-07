import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsBranchFilterComponent } from './products-branch-filter.component';

describe('ProductsBranchFilterComponent', () => {
  let component: ProductsBranchFilterComponent;
  let fixture: ComponentFixture<ProductsBranchFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsBranchFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsBranchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
