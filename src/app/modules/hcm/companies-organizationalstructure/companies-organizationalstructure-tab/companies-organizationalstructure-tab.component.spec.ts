import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesOrganizationalstructureTabComponent } from './companies-organizationalstructure-tab.component';


describe('CompaniesOrganizationalstructureTabComponent', () => {
  let component: CompaniesOrganizationalstructureTabComponent;
  let fixture: ComponentFixture<CompaniesOrganizationalstructureTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesOrganizationalstructureTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesOrganizationalstructureTabComponent); 
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
