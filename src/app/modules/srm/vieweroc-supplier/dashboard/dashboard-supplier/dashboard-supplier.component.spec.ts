import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSupplierComponent } from './dashboard-supplier.component';

describe('DashboardSupplierComponent', () => {
  let component: DashboardSupplierComponent;
  let fixture: ComponentFixture<DashboardSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardSupplierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
