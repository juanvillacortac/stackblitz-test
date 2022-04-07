import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesGeneralinfoTabComponent } from './companies-generalinfo-tab.component';

describe('CompaniesGeneralinfoTabComponent', () => {
  let component: CompaniesGeneralinfoTabComponent;
  let fixture: ComponentFixture<CompaniesGeneralinfoTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesGeneralinfoTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesGeneralinfoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
