import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesConceptsListComponent } from './companies-concepts-list.component';

describe('CompaniesConceptsListComponent', () => {
  let component: CompaniesConceptsListComponent;
  let fixture: ComponentFixture<CompaniesConceptsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesConceptsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesConceptsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
