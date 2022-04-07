import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCountPanelComponent } from './inventory-count-panel.component';

describe('InventoryCountPanelComponent', () => {
  let component: InventoryCountPanelComponent;
  let fixture: ComponentFixture<InventoryCountPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryCountPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCountPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
