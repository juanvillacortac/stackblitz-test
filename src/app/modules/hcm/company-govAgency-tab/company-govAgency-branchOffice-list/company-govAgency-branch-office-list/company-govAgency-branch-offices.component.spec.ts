import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyGovernmentalAgencyBranchOfficeListComponent } from './company-governmental-agency-branch-office-list.component';

describe('CompanyGovernmentalAgencyBranchOfficeListComponent', () => {
  let component: CompanyGovernmentalAgencyBranchOfficeListComponent;
  let fixture: ComponentFixture<CompanyGovernmentalAgencyBranchOfficeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyGovernmentalAgencyBranchOfficeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyGovernmentalAgencyBranchOfficeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
