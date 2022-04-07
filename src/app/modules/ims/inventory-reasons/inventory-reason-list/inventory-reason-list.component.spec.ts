import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReasonListComponent } from './inventory-reason-list.component';

describe('InventoryReasonListComponent', () => {
  let component: InventoryReasonListComponent;
  let fixture: ComponentFixture<InventoryReasonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryReasonListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryReasonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
