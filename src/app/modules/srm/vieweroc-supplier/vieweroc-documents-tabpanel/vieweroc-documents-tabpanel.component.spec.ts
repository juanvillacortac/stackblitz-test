import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerocDocumentsTabpanelComponent } from './vieweroc-documents-tabpanel.component';

describe('ViewerocDocumentsTabpanelComponent', () => {
  let component: ViewerocDocumentsTabpanelComponent;
  let fixture: ComponentFixture<ViewerocDocumentsTabpanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerocDocumentsTabpanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerocDocumentsTabpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
