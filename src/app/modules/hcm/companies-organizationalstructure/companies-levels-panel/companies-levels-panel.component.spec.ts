import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesLevelsPanelComponent } from './companies-levels-panel.component';

describe('CompaniesLevelsPanelComponent', () => {
  let component: CompaniesLevelsPanelComponent;
  let fixture: ComponentFixture<CompaniesLevelsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesLevelsPanelComponent ]
    })
    .compileComponents();
  }); 

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesLevelsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
