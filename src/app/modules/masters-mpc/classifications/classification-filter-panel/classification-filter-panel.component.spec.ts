import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationFilterPanelComponent } from './classification-filter-panel.component';

describe('ClassificationFilterPanelComponent', () => {
  let component: ClassificationFilterPanelComponent;
  let fixture: ComponentFixture<ClassificationFilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassificationFilterPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationFilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
