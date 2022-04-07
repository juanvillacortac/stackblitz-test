import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterVehiclePanelComponent } from './master-vehicle-panel.component';

describe('MasterVehiclePanelComponent', () => {
  let component: MasterVehiclePanelComponent;
  let fixture: ComponentFixture<MasterVehiclePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterVehiclePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterVehiclePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
