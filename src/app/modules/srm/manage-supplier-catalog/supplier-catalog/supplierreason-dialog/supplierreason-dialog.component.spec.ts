import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierreasonDialogComponent } from './supplierreason-dialog.component';

describe('SupplierreasonDialogComponent', () => {
  let component: SupplierreasonDialogComponent;
  let fixture: ComponentFixture<SupplierreasonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierreasonDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierreasonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
