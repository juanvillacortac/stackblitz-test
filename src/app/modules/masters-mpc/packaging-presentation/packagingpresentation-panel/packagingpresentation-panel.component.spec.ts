import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingpresentationPanelComponent } from './packagingpresentation-panel.component';

describe('PackagingpresentationPanelComponent', () => {
  let component: PackagingpresentationPanelComponent;
  let fixture: ComponentFixture<PackagingpresentationPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackagingpresentationPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagingpresentationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
