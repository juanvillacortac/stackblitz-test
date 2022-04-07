import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCountModalComponent } from './inventory-count-modal.component';

describe('InventoryCountModalComponent', () => {
  let component: InventoryCountModalComponent;
  let fixture: ComponentFixture<InventoryCountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryCountModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
