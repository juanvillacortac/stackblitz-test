import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesConceptsGeneralinfoComponent } from './companies-concepts-generalinfo.component';

describe('CompaniesConceptsGeneralinfoComponent', () => {
  let component: CompaniesConceptsGeneralinfoComponent;
  let fixture: ComponentFixture<CompaniesConceptsGeneralinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesConceptsGeneralinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesConceptsGeneralinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
