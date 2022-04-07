import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLayaoutComponent } from './dashboard-layaout.component';

describe('DashboardLayaoutComponent', () => {
  let component: DashboardLayaoutComponent;
  let fixture: ComponentFixture<DashboardLayaoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardLayaoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLayaoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
