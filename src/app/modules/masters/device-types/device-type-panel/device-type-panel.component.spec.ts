import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTypePanelComponent } from './device-type-panel.component';
//Coment
describe('DeviceTypePanelComponent', () => {
  let component: DeviceTypePanelComponent;
  let fixture: ComponentFixture<DeviceTypePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceTypePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceTypePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
