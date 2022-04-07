import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesCatalogEditDialogComponent } from './companies-catalog-edit-dialog.component';

describe('CompaniesCatalogEditDialogComponent', () => {
  let component: CompaniesCatalogEditDialogComponent;
  let fixture: ComponentFixture<CompaniesCatalogEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesCatalogEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesCatalogEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
