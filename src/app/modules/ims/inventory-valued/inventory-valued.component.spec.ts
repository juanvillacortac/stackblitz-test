import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryValuedComponent } from './inventory-valued.component';

describe('InventoryValuedComponent', () => {
  let component: InventoryValuedComponent;
  let fixture: ComponentFixture<InventoryValuedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryValuedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryValuedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
