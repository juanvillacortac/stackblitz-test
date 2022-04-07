import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotsFiltersComponent } from './lots-filters.component';

describe('LotsFiltersComponent', () => {
  let component: LotsFiltersComponent;
  let fixture: ComponentFixture<LotsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotsFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
