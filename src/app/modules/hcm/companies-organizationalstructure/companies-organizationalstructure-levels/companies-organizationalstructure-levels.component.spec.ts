import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesOrganizationalstructureLevelsComponent } from './companies-organizationalstructure-levels.component';

describe('CompaniesOrganizationalstructureLevelsComponent', () => {
  let component: CompaniesOrganizationalstructureLevelsComponent;
  let fixture: ComponentFixture<CompaniesOrganizationalstructureLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesOrganizationalstructureLevelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesOrganizationalstructureLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
