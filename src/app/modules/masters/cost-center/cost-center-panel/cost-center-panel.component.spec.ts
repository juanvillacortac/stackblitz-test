import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterPanelComponent } from './cost-center-panel.component';

describe('CostCenterPanelComponent', () => {
  let component: CostCenterPanelComponent;
  let fixture: ComponentFixture<CostCenterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCenterPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
