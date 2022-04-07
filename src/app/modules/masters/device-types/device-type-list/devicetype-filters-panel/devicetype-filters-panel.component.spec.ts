import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicetypeFiltersPanelComponent } from './devicetype-filters-panel.component';
//coment
describe('DevicetypeFiltersPanelComponent', () => {
  let component: DevicetypeFiltersPanelComponent;
  let fixture: ComponentFixture<DevicetypeFiltersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevicetypeFiltersPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicetypeFiltersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
