import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesEmployeeFilterComponent } from './companies-employee-filter.component';

describe('CompaniesEmployeeFilterComponent', () => {
  let component: CompaniesEmployeeFilterComponent;
  let fixture: ComponentFixture<CompaniesEmployeeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesEmployeeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesEmployeeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
