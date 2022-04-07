import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupingInventoryResasonListComponent } from './grouping-inventory-resason-list.component';

describe('GroupingInventoryResasonListComponent', () => {
  let component: GroupingInventoryResasonListComponent;
  let fixture: ComponentFixture<GroupingInventoryResasonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupingInventoryResasonListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupingInventoryResasonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
