import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliercatalogComponent } from './suppliercatalog.component';

describe('SuppliercatalogComponent', () => {
  let component: SuppliercatalogComponent;
  let fixture: ComponentFixture<SuppliercatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppliercatalogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliercatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
