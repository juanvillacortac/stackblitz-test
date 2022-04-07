import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyGovernmentalAgencyListComponent } from './company-governmental-agency-list.component';

describe('CompanyGovernmentalAgencyListComponent', () => {
  let component: CompanyGovernmentalAgencyListComponent;
  let fixture: ComponentFixture<CompanyGovernmentalAgencyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyGovernmentalAgencyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyGovernmentalAgencyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
