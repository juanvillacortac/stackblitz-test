import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceClaimListComponent } from './maintenance-claim-list.component';

describe('MaintenanceClaimListComponent', () => {
  let component: MaintenanceClaimListComponent;
  let fixture: ComponentFixture<MaintenanceClaimListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceClaimListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceClaimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
