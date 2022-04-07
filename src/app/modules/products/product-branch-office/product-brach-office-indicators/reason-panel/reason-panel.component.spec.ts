import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonPanelComponent } from './reason-panel.component';

describe('ReasonPanelComponent', () => {
  let component: ReasonPanelComponent;
  let fixture: ComponentFixture<ReasonPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasonPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
