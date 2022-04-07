import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionSupplierComponent } from './reception-supplier.component';

describe('ReceptionSupplierComponent', () => {
  let component: ReceptionSupplierComponent;
  let fixture: ComponentFixture<ReceptionSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionSupplierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
