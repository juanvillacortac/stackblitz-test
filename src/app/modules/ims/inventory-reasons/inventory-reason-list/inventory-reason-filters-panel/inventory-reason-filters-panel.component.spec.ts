import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReasonFiltersPanelComponent } from './inventory-reason-filters-panel.component';

describe('InventoryReasonFiltersPanelComponent', () => {
  let component: InventoryReasonFiltersPanelComponent;
  let fixture: ComponentFixture<InventoryReasonFiltersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryReasonFiltersPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryReasonFiltersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
