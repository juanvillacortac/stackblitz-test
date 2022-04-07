import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyGovernmentalAgencyFilterComponent } from './company-governmental-agency-filter.component';

describe('CompanyGovernmentalAgencyFilterComponent', () => {
  let component: CompanyGovernmentalAgencyFilterComponent;
  let fixture: ComponentFixture<CompanyGovernmentalAgencyFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyGovernmentalAgencyFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyGovernmentalAgencyFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
