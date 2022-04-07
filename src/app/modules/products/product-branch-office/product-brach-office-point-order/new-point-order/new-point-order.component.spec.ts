import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPointOrderComponent } from './new-point-order.component';

describe('NewPointOrderComponent', () => {
  let component: NewPointOrderComponent;
  let fixture: ComponentFixture<NewPointOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPointOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPointOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
