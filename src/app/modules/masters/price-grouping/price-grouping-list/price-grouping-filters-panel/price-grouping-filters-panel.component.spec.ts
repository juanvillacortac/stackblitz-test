import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceGroupingFiltersPanelComponent } from './price-grouping-filters-panel.component';

describe('PriceGroupingFiltersPanelComponent', () => {
  let component: PriceGroupingFiltersPanelComponent;
  let fixture: ComponentFixture<PriceGroupingFiltersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceGroupingFiltersPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceGroupingFiltersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
