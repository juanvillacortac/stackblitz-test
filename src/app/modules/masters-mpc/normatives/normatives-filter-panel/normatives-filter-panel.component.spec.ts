import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormativesFilterPanelComponent } from './normatives-filter-panel.component';

describe('NormativesFilterPanelComponent', () => {
  let component: NormativesFilterPanelComponent;
  let fixture: ComponentFixture<NormativesFilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NormativesFilterPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NormativesFilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
