import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersCatalogModalComponent } from './suppliers-catalog-modal.component';

describe('SuppliersCatalogModalComponent', () => {
  let component: SuppliersCatalogModalComponent;
  let fixture: ComponentFixture<SuppliersCatalogModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppliersCatalogModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliersCatalogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
