import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMovementSubsidiaryComponent } from './employee-movement-subsidiary.component';

describe('EmployeeMovementSubsidiaryComponent', () => {
  let component: EmployeeMovementSubsidiaryComponent;
  let fixture: ComponentFixture<EmployeeMovementSubsidiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeMovementSubsidiaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMovementSubsidiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
