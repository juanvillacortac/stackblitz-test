import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesConceptsGroupingPanelComponent } from './companies-concepts-grouping-panel.component';

describe('CompaniesConceptsGroupingPanelComponent', () => {
  let component: CompaniesConceptsGroupingPanelComponent;
  let fixture: ComponentFixture<CompaniesConceptsGroupingPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesConceptsGroupingPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesConceptsGroupingPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
