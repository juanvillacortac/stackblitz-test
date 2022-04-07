import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressesDetailsComponent } from './addresses-details.component';

describe('AddressesDetailsComponent', () => {
  let component: AddressesDetailsComponent;
  let fixture: ComponentFixture<AddressesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
