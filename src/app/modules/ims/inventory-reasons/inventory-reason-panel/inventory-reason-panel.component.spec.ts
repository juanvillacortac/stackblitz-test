import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReasonPanelComponent } from './inventory-reason-panel.component';

describe('InventoryReasonPanelComponent', () => {
  let component: InventoryReasonPanelComponent;
  let fixture: ComponentFixture<InventoryReasonPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryReasonPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryReasonPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
