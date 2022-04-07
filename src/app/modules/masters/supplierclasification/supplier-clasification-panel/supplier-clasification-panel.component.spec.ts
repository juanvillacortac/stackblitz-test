import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierClasificationPanelComponent } from './supplier-clasification-panel.component';

describe('SupplierClasificationPanelComponent', () => {
  let component: SupplierClasificationPanelComponent;
  let fixture: ComponentFixture<SupplierClasificationPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierClasificationPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierClasificationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
