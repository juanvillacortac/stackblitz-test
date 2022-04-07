import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceGroupingPanelComponent } from './price-grouping-panel.component';

describe('PriceGroupingPanelComponent', () => {
  let component: PriceGroupingPanelComponent;
  let fixture: ComponentFixture<PriceGroupingPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceGroupingPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceGroupingPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
