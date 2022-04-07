import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalVariablesPanelComponent } from './global-variables-panel.component';

describe('GlobalVariablesPanelComponent', () => {
  let component: GlobalVariablesPanelComponent;
  let fixture: ComponentFixture<GlobalVariablesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalVariablesPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalVariablesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
