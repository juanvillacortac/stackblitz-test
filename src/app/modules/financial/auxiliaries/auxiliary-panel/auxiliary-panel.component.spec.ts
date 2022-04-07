import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxiliaryPanelComponent } from './auxiliary-panel.component';

describe('AuxiliaryPanelComponent', () => {
  let component: AuxiliaryPanelComponent;
  let fixture: ComponentFixture<AuxiliaryPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuxiliaryPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuxiliaryPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
