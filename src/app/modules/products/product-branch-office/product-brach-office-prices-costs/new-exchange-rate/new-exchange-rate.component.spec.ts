import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExchangeRateComponent } from './new-exchange-rate.component';

describe('NewExchangeRateComponent', () => {
  let component: NewExchangeRateComponent;
  let fixture: ComponentFixture<NewExchangeRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewExchangeRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewExchangeRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
