import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborRelationshipGroupingTabComponent } from './labor-relationship-grouping-tab.component';

describe('LaborRelationshipGroupingTabComponent', () => {
  let component: LaborRelationshipGroupingTabComponent;
  let fixture: ComponentFixture<LaborRelationshipGroupingTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaborRelationshipGroupingTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaborRelationshipGroupingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
