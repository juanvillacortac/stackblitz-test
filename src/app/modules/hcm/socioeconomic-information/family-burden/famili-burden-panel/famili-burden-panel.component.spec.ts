import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamiliBurdenPanelComponent } from './famili-burden-panel.component';

describe('FamiliBurdenPanelComponent', () => {
  let component: FamiliBurdenPanelComponent;
  let fixture: ComponentFixture<FamiliBurdenPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamiliBurdenPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamiliBurdenPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
