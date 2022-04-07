import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupingInventoryReasonsFilterComponent } from './grouping-inventory-reasons-filter.component';

describe('GroupingInventoryReasonsFilterComponent', () => {
  let component: GroupingInventoryReasonsFilterComponent;
  let fixture: ComponentFixture<GroupingInventoryReasonsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupingInventoryReasonsFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupingInventoryReasonsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
