import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierClasificationFilterComponent } from './supplier-clasification-filter.component';

describe('SupplierClasificationFilterComponent', () => {
  let component: SupplierClasificationFilterComponent;
  let fixture: ComponentFixture<SupplierClasificationFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierClasificationFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierClasificationFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
