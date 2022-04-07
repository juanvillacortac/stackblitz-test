import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGeneralSrmComponent } from './dashboard-general-srm.component';

describe('DashboardGeneralSrmComponent', () => {
  let component: DashboardGeneralSrmComponent;
  let fixture: ComponentFixture<DashboardGeneralSrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardGeneralSrmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardGeneralSrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
