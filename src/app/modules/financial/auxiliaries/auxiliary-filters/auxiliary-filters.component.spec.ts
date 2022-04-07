import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxiliaryFiltersComponent } from './auxiliary-filters.component';

describe('AuxiliaryFiltersComponent', () => {
  let component: AuxiliaryFiltersComponent;
  let fixture: ComponentFixture<AuxiliaryFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuxiliaryFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuxiliaryFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
