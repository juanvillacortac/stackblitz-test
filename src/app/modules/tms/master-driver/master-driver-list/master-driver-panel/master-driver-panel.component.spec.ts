import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDriverPanelComponent } from './master-driver-panel.component';

describe('MasterDriverPanelComponent', () => {
  let component: MasterDriverPanelComponent;
  let fixture: ComponentFixture<MasterDriverPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDriverPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDriverPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
