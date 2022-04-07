import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactNumberSuppliersMasiveComponent } from './contact-number-suppliers-masive.component';

describe('ContactNumberSuppliersMasiveComponent', () => {
  let component: ContactNumberSuppliersMasiveComponent;
  let fixture: ComponentFixture<ContactNumberSuppliersMasiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactNumberSuppliersMasiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactNumberSuppliersMasiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
