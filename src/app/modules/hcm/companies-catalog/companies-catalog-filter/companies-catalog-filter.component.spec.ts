import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesCatalogFilterComponent } from './companies-catalog-filter.component';

describe('CompaniesCatalogFilterComponent', () => {
  let component: CompaniesCatalogFilterComponent;
  let fixture: ComponentFixture<CompaniesCatalogFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesCatalogFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesCatalogFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
