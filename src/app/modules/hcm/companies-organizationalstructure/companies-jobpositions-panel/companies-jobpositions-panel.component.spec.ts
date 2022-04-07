import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesJobpositionsPanelComponent } from './companies-jobpositions-panel.component';

describe('CompaniesJobpositionsPanelComponent', () => { 
  let component: CompaniesJobpositionsPanelComponent;
  let fixture: ComponentFixture<CompaniesJobpositionsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesJobpositionsPanelComponent ]
    })
    .compileComponents();
  });
   
  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesJobpositionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
