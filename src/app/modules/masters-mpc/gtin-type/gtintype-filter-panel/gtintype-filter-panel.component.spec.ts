import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GtintypeFilterPanelComponent } from './gtintype-filter-panel.component';

describe('GtintypeFilterPanelComponent', () => {
  let component: GtintypeFilterPanelComponent;
  let fixture: ComponentFixture<GtintypeFilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GtintypeFilterPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GtintypeFilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
