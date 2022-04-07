import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialsFiltersComponent } from './raw-materials-filters.component';

describe('RawMaterialsFiltersComponent', () => {
  let component: RawMaterialsFiltersComponent;
  let fixture: ComponentFixture<RawMaterialsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawMaterialsFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RawMaterialsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
