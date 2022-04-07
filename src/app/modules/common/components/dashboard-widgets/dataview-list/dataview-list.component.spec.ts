import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataviewListComponent } from './dataview-list.component';

describe('DataviewListComponent', () => {
  let component: DataviewListComponent;
  let fixture: ComponentFixture<DataviewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataviewListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
