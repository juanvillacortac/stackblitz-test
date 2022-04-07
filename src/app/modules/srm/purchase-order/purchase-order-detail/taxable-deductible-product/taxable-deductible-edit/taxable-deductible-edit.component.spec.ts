import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxableDeductibleEditComponent } from './taxable-deductible-edit.component';

describe('TaxableDeductibleEditComponent', () => {
  let component: TaxableDeductibleEditComponent;
  let fixture: ComponentFixture<TaxableDeductibleEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxableDeductibleEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxableDeductibleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
