import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupingInventoryReasonsPanelComponent } from './grouping-inventory-reasons-panel.component';

describe('GroupingInventoryReasonsPanelComponent', () => {
  let component: GroupingInventoryReasonsPanelComponent;
  let fixture: ComponentFixture<GroupingInventoryReasonsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupingInventoryReasonsPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupingInventoryReasonsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
