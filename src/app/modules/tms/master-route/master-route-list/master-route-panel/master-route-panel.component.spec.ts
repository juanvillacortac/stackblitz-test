import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterRoutePanelComponent } from './master-route-panel.component';

describe('MasterRoutePanelComponent', () => {
  let component: MasterRoutePanelComponent;
  let fixture: ComponentFixture<MasterRoutePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterRoutePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterRoutePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
