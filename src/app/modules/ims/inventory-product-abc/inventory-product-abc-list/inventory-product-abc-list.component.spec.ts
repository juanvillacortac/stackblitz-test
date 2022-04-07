import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryProductAbcListComponent } from './inventory-product-abc-list.component';

describe('InventoryProductAbcListComponent', () => {
  let component: InventoryProductAbcListComponent;
  let fixture: ComponentFixture<InventoryProductAbcListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryProductAbcListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryProductAbcListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
