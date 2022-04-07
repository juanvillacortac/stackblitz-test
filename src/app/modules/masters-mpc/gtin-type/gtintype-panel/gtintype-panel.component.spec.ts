import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GtintypePanelComponent } from './gtintype-panel.component';

describe('GtintypePanelComponent', () => {
  let component: GtintypePanelComponent;
  let fixture: ComponentFixture<GtintypePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GtintypePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GtintypePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
