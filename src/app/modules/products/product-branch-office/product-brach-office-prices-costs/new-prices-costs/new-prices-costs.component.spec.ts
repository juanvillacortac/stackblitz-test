import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPricesCostsComponent } from './new-prices-costs.component';

describe('NewPricesCostsComponent', () => {
  let component: NewPricesCostsComponent;
  let fixture: ComponentFixture<NewPricesCostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPricesCostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPricesCostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
