import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDetailMovementPanelComponent } from './general-detail-movement-panel.component';

describe('GeneralDetailMovementPanelComponent', () => {
  let component: GeneralDetailMovementPanelComponent;
  let fixture: ComponentFixture<GeneralDetailMovementPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralDetailMovementPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralDetailMovementPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
