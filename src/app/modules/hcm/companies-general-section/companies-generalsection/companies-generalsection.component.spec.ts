import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesGeneralsectionComponent } from './companies-generalsection.component';

describe('CompaniesGeneralsectionComponent', () => {
  let component: CompaniesGeneralsectionComponent;
  let fixture: ComponentFixture<CompaniesGeneralsectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesGeneralsectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesGeneralsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
