import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryLotAndExpirationDateModalComponent } from './inventory-lot-and-expiration-date-modal.component';

describe('InventoryLotAndExpirationDateModalComponent', () => {
  let component: InventoryLotAndExpirationDateModalComponent;
  let fixture: ComponentFixture<InventoryLotAndExpirationDateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryLotAndExpirationDateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryLotAndExpirationDateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
