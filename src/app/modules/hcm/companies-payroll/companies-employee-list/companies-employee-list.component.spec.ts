import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesEmployeeListComponent } from './companies-employee-list.component';

describe('CompaniesEmployeeListComponent', () => {
  let component: CompaniesEmployeeListComponent;
  let fixture: ComponentFixture<CompaniesEmployeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesEmployeeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesEmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
