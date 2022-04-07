import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesOrganizationalstructureChartComponent } from './companies-organizationalstructure-chart.component';

describe('CompaniesOrganizationalstructureChartComponent', () => {
  let component: CompaniesOrganizationalstructureChartComponent;
  let fixture: ComponentFixture<CompaniesOrganizationalstructureChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesOrganizationalstructureChartComponent ]
    }) 
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesOrganizationalstructureChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
