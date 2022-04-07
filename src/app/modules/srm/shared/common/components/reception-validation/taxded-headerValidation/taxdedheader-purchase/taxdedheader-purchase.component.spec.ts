import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxdedheaderPurchaseComponent } from './taxdedheader-purchase.component';

describe('TaxdedheaderPurchaseComponent', () => {
  let component: TaxdedheaderPurchaseComponent;
  let fixture: ComponentFixture<TaxdedheaderPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxdedheaderPurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxdedheaderPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
