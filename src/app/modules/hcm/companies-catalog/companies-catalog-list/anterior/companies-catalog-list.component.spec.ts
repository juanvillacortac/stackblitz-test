import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesCatalogListComponent } from './companies-catalog-list.component';

describe('CompaniesCatalogListComponent', () => {
  let component: CompaniesCatalogListComponent;
  let fixture: ComponentFixture<CompaniesCatalogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesCatalogListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesCatalogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
