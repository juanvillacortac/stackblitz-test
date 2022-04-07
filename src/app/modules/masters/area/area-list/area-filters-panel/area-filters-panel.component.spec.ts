import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaFiltersPanelComponent } from './area-filters-panel.component';

describe('AreaFiltersPanelComponent', () => {
  let component: AreaFiltersPanelComponent;
  let fixture: ComponentFixture<AreaFiltersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaFiltersPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaFiltersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
