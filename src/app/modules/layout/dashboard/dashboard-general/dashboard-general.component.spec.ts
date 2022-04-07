import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGeneralComponent } from './dashboard-general.component';

describe('DashboardGeneralComponent', () => {
  let component: DashboardGeneralComponent;
  let fixture: ComponentFixture<DashboardGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
