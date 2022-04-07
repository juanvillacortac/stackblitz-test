import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLotPointOrderComponent } from './new-lot-point-order.component';

describe('NewLotPointOrderComponent', () => {
  let component: NewLotPointOrderComponent;
  let fixture: ComponentFixture<NewLotPointOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLotPointOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLotPointOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
