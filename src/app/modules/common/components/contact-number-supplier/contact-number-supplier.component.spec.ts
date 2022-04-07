import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactNumberSupplierComponent } from './contact-number-supplier.component';

describe('ContactNumberSupplierComponent', () => {
  let component: ContactNumberSupplierComponent;
  let fixture: ComponentFixture<ContactNumberSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactNumberSupplierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactNumberSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
