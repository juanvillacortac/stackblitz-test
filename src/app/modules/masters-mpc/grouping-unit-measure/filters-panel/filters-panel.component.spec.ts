import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersPanelComponentGroupingUnitMeasure } from './filters-panel.component';

describe('FiltersPanelComponent', () => {
  let component: FiltersPanelComponentGroupingUnitMeasure;
  let fixture: ComponentFixture<FiltersPanelComponentGroupingUnitMeasure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiltersPanelComponentGroupingUnitMeasure ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersPanelComponentGroupingUnitMeasure);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
