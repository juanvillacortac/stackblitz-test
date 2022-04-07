import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsSuppliersComponent } from './contacts-suppliers.component';

describe('ContactsSuppliersComponent', () => {
  let component: ContactsSuppliersComponent;
  let fixture: ComponentFixture<ContactsSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactsSuppliersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
