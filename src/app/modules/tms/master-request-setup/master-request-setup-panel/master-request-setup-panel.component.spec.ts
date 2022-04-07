import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterRequestSetupPanelComponent } from './master-request-setup-panel.component';

describe('MasterRequestSetupPanelComponent', () => {
  let component: MasterRequestSetupPanelComponent;
  let fixture: ComponentFixture<MasterRequestSetupPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterRequestSetupPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterRequestSetupPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
