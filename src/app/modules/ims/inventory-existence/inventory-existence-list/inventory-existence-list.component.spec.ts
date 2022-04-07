import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryExistenceListComponent } from './inventory-existence-list.component';

describe('InventoryExistenceListComponent', () => {
  let component: InventoryExistenceListComponent;
  let fixture: ComponentFixture<InventoryExistenceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryExistenceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryExistenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
