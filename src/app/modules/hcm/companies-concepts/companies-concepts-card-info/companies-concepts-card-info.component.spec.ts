import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesConceptsCardInfoComponent } from './companies-concepts-card-info.component';

describe('CompaniesConceptsCardInfoComponent', () => {
  let component: CompaniesConceptsCardInfoComponent;
  let fixture: ComponentFixture<CompaniesConceptsCardInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesConceptsCardInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesConceptsCardInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
