import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLotPricesCostsComponent } from './new-lot-prices-costs.component';

describe('NewLotPricesCostsComponent', () => {
  let component: NewLotPricesCostsComponent;
  let fixture: ComponentFixture<NewLotPricesCostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLotPricesCostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLotPricesCostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
