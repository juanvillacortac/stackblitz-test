import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierClasificationListComponent } from './supplier-clasification-list.component';

describe('SupplierClasificationListComponent', () => {
  let component: SupplierClasificationListComponent;
  let fixture: ComponentFixture<SupplierClasificationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierClasificationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierClasificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
