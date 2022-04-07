import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesConceptsGeneralsectionMainComponent } from './companies-concepts-generalsection-main.component';

describe('CompaniesConceptsGeneralsectionMainComponent', () => {
  let component: CompaniesConceptsGeneralsectionMainComponent;
  let fixture: ComponentFixture<CompaniesConceptsGeneralsectionMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesConceptsGeneralsectionMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesConceptsGeneralsectionMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
