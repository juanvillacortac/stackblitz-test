import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingpresentationFilterPanelComponent } from './packagingpresentation-filter-panel.component';

describe('PackagingpresentationFilterPanelComponent', () => {
  let component: PackagingpresentationFilterPanelComponent;
  let fixture: ComponentFixture<PackagingpresentationFilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackagingpresentationFilterPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagingpresentationFilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
