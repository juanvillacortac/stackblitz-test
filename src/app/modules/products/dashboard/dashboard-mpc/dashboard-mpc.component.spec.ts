import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMpcComponent } from './dashboard-mpc.component';

describe('DashboardMpcComponent', () => {
  let component: DashboardMpcComponent;
  let fixture: ComponentFixture<DashboardMpcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardMpcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
