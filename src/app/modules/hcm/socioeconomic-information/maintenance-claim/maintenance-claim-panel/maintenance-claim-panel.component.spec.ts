import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceClaimPanelComponent } from './maintenance-claim-panel.component';

describe('MaintenanceClaimPanelComponent', () => {
  let component: MaintenanceClaimPanelComponent;
  let fixture: ComponentFixture<MaintenanceClaimPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceClaimPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceClaimPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
