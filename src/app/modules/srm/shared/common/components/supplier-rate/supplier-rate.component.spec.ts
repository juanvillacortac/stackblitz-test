import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierRateComponent } from './supplier-rate.component';

describe('SupplierRateComponent', () => {
  let component: SupplierRateComponent;
  let fixture: ComponentFixture<SupplierRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
