import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersPanelComponentMultimediaUse } from './filters-panel.component';

describe('FiltersPanelComponent', () => {
  let component: FiltersPanelComponentMultimediaUse;
  let fixture: ComponentFixture<FiltersPanelComponentMultimediaUse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiltersPanelComponentMultimediaUse ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersPanelComponentMultimediaUse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
