import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanybarComponent } from './companybar.component';

describe('CompanybarComponent', () => {
  let component: CompanybarComponent;
  let fixture: ComponentFixture<CompanybarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanybarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanybarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
