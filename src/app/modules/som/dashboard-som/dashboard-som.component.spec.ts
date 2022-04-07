import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSomComponent } from './dashboard-som.component';

describe('DashboardSomComponent', () => {
  let component: DashboardSomComponent;
  let fixture: ComponentFixture<DashboardSomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardSomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
