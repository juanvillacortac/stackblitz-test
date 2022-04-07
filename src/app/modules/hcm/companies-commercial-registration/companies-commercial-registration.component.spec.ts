import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesCommercialRegistrationComponent } from './companies-commercial-registration.component';

describe('CompaniesCommercialRegistrationComponent', () => {
  let component: CompaniesCommercialRegistrationComponent;
  let fixture: ComponentFixture<CompaniesCommercialRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesCommercialRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesCommercialRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
