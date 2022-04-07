import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalConditionPanelComponent } from './medical-condition-panel.component';

describe('MedicalConditionPanelComponent', () => {
  let component: MedicalConditionPanelComponent;
  let fixture: ComponentFixture<MedicalConditionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalConditionPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalConditionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
