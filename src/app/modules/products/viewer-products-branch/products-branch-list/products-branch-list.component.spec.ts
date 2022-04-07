import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsBranchListComponent } from './products-branch-list.component';

describe('ProductsBranchListComponent', () => {
  let component: ProductsBranchListComponent;
  let fixture: ComponentFixture<ProductsBranchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsBranchListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsBranchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
