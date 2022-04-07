import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryPackOperationDetailComponent } from './inventory-pack-operation-detail.component';

describe('InventoryPackOperationDetailComponent', () => {
  let component: InventoryPackOperationDetailComponent;
  let fixture: ComponentFixture<InventoryPackOperationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryPackOperationDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryPackOperationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
