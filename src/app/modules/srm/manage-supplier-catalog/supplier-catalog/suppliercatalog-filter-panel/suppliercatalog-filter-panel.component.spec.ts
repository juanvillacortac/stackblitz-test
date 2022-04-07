import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliercatalogFilterPanelComponent } from './suppliercatalog-filter-panel.component';

describe('SuppliercatalogFilterPanelComponent', () => {
  let component: SuppliercatalogFilterPanelComponent;
  let fixture: ComponentFixture<SuppliercatalogFilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppliercatalogFilterPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliercatalogFilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
