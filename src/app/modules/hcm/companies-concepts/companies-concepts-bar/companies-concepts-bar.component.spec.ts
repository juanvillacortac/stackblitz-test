import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesConceptsBarComponent } from './companies-concepts-bar.component';

describe('CompaniesConceptsBarComponent', () => {
  let component: CompaniesConceptsBarComponent;
  let fixture: ComponentFixture<CompaniesConceptsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesConceptsBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesConceptsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
