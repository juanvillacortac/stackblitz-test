import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaxDedPurchaseComponent } from './view-tax-ded-purchase.component';

describe('ViewTaxDedPurchaseComponent', () => {
  let component: ViewTaxDedPurchaseComponent;
  let fixture: ComponentFixture<ViewTaxDedPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTaxDedPurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTaxDedPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
