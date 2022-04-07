import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesAddressesComponent } from './companies-addresses.component';

describe('CompaniesAddressesComponent', () => {
  let component: CompaniesAddressesComponent;
  let fixture: ComponentFixture<CompaniesAddressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesAddressesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
