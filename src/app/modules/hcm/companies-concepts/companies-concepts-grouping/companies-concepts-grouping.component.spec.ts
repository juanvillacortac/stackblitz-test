import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesConceptsGroupingComponent } from './companies-concepts-grouping.component';

describe('CompaniesConceptsGroupingComponent', () => {
  let component: CompaniesConceptsGroupingComponent;
  let fixture: ComponentFixture<CompaniesConceptsGroupingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesConceptsGroupingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesConceptsGroupingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
