import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyGovernmentalAgencyEditDialogComponent } from './company-govAgency-edit.component';

describe('CompanyGovernmentalAgencyEditDialogComponent', () => {
  let component: CompanyGovernmentalAgencyEditDialogComponent;
  let fixture: ComponentFixture<CompanyGovernmentalAgencyEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyGovernmentalAgencyEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyGovernmentalAgencyEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
