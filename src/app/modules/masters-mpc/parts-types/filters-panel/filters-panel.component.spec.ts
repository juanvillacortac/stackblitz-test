import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersPanelComponentTypeofParts } from './filters-panel.component';

describe('FiltersPanelComponent', () => {
  let component: FiltersPanelComponentTypeofParts;
  let fixture: ComponentFixture<FiltersPanelComponentTypeofParts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltersPanelComponentTypeofParts ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersPanelComponentTypeofParts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
