import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterFiltersComponent } from './cost-center-filters.component';

describe('CostCenterFiltersComponent', () => {
  let component: CostCenterFiltersComponent;
  let fixture: ComponentFixture<CostCenterFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCenterFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
