import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborRelationshipGroupingListComponent } from './labor-relationship-grouping-list.component';

describe('LaborRelationshipGroupingListComponent', () => {
  let component: LaborRelationshipGroupingListComponent;
  let fixture: ComponentFixture<LaborRelationshipGroupingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaborRelationshipGroupingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaborRelationshipGroupingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
