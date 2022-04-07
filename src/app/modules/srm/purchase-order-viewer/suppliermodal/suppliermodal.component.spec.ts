import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliermodalComponent } from './suppliermodal.component';

describe('SuppliermodalComponent', () => {
  let component: SuppliermodalComponent;
  let fixture: ComponentFixture<SuppliermodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppliermodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliermodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
