import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierModalListComponent } from './supplier-modal-list.component';

describe('SupplierModalListComponent', () => {
  let component: SupplierModalListComponent;
  let fixture: ComponentFixture<SupplierModalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierModalListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierModalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
