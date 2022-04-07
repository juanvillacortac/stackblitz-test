import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSituationSubsidiaryComponent } from './employee-situation-subsidiary.component';

describe('EmployeeSituationSubsidiaryComponent', () => {
  let component: EmployeeSituationSubsidiaryComponent;
  let fixture: ComponentFixture<EmployeeSituationSubsidiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeSituationSubsidiaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSituationSubsidiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
