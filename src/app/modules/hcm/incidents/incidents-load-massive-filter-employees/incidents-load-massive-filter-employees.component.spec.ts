import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsLoadMassiveFilterEmployeesComponent } from './incidents-load-massive-filter-employees.component';

describe('IncidentsLoadMassiveFilterEmployeesComponent', () => {
  let component: IncidentsLoadMassiveFilterEmployeesComponent;
  let fixture: ComponentFixture<IncidentsLoadMassiveFilterEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentsLoadMassiveFilterEmployeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentsLoadMassiveFilterEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
