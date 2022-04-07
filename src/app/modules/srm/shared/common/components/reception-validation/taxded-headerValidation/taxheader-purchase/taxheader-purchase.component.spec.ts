import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxheaderPurchaseComponent } from './taxheader-purchase.component';

describe('TaxheaderPurchaseComponent', () => {
  let component: TaxheaderPurchaseComponent;
  let fixture: ComponentFixture<TaxheaderPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxheaderPurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxheaderPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
