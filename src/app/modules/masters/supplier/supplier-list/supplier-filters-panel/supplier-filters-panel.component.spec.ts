import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierFiltersPanelComponent } from './supplier-filters-panel.component';

describe('SupplierFiltersPanelComponent', () => {
  let component: SupplierFiltersPanelComponent;
  let fixture: ComponentFixture<SupplierFiltersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierFiltersPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierFiltersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
