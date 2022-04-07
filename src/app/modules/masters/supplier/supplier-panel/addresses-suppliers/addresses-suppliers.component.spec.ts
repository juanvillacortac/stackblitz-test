import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressesSuppliersComponent } from './addresses-suppliers.component';

describe('AddressesSuppliersComponent', () => {
  let component: AddressesSuppliersComponent;
  let fixture: ComponentFixture<AddressesSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressesSuppliersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressesSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
