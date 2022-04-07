import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSuppliermodalComponent } from './filter-suppliermodal.component';

describe('FilterSuppliermodalComponent', () => {
  let component: FilterSuppliermodalComponent;
  let fixture: ComponentFixture<FilterSuppliermodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterSuppliermodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSuppliermodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
