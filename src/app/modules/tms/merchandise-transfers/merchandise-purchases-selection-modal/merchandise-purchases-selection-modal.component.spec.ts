import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandisePurchasesSelectionModalComponent } from './merchandise-purchases-selection-modal.component';

describe('MerchandisePurchasesSelectionModalComponent', () => {
  let component: MerchandisePurchasesSelectionModalComponent;
  let fixture: ComponentFixture<MerchandisePurchasesSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandisePurchasesSelectionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandisePurchasesSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
