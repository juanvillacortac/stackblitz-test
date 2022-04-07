import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAggregateVehicleDriverComponent } from './modal-aggregate-vehicle-driver.component';

describe('ModalAggregateVehicleDriverComponent', () => {
  let component: ModalAggregateVehicleDriverComponent;
  let fixture: ComponentFixture<ModalAggregateVehicleDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAggregateVehicleDriverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAggregateVehicleDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
