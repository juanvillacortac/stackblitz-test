import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborRelationshipGroupingPanelComponent } from './labor-relationship-grouping-panel.component';

describe('LaborRelationshipGroupingPanelComponent', () => {
  let component: LaborRelationshipGroupingPanelComponent;
  let fixture: ComponentFixture<LaborRelationshipGroupingPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaborRelationshipGroupingPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaborRelationshipGroupingPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
