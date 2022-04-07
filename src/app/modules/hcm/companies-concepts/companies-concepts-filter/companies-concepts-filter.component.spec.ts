import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesConceptsFilterComponent } from './companies-concepts-filter.component';

describe('CompaniesConceptsFilterComponent', () => {
  let component: CompaniesConceptsFilterComponent;
  let fixture: ComponentFixture<CompaniesConceptsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesConceptsFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesConceptsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
