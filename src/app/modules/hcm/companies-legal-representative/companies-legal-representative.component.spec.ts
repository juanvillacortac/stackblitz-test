import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesLegalRepresentativeComponent } from './companies-legal-representative.component';

describe('CompaniesLegalRepresentativeComponent', () => {
  let component: CompaniesLegalRepresentativeComponent;
  let fixture: ComponentFixture<CompaniesLegalRepresentativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesLegalRepresentativeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesLegalRepresentativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
