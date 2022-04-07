import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesOrganizationalstructurePositionsComponent } from './companies-organizationalstructure-positions.component';

describe('CompaniesOrganizationalstructurePositionsComponent', () => {
  let component: CompaniesOrganizationalstructurePositionsComponent;
  let fixture: ComponentFixture<CompaniesOrganizationalstructurePositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesOrganizationalstructurePositionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesOrganizationalstructurePositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
   
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
