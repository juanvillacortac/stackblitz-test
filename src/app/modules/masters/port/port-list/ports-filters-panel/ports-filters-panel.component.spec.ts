import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortsFiltersPanelComponent } from './ports-filters-panel.component';

describe('PortsFiltersPanelComponent', () => {
  let component: PortsFiltersPanelComponent;
  let fixture: ComponentFixture<PortsFiltersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortsFiltersPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortsFiltersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
