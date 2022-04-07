import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCommonModalComponent } from './supplier-common-modal.component';

describe('SupplierCommonModalComponent', () => {
  let component: SupplierCommonModalComponent;
  let fixture: ComponentFixture<SupplierCommonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierCommonModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCommonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
