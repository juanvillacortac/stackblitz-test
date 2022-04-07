import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOfficesComparativesListComponent } from './inventory-offices-comparatives-list.component';

describe('InventoryOfficesComparativesListComponent', () => {
  let component: InventoryOfficesComparativesListComponent;
  let fixture: ComponentFixture<InventoryOfficesComparativesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryOfficesComparativesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryOfficesComparativesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
