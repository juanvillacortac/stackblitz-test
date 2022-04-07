import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortPanelComponent } from './port-panel.component';

describe('PortPanelComponent', () => {
  let component: PortPanelComponent;
  let fixture: ComponentFixture<PortPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
