import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupingunitmeasureComponent } from './groupingunitmeasure.component';

describe('GroupingunitmeasureComponent', () => {
  let component: GroupingunitmeasureComponent;
  let fixture: ComponentFixture<GroupingunitmeasureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupingunitmeasureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupingunitmeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
