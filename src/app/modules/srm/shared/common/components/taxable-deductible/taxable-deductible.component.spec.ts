import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxableDeductibleComponent } from './taxable-deductible.component';

describe('TaxableDeductibleComponent', () => {
  let component: TaxableDeductibleComponent;
  let fixture: ComponentFixture<TaxableDeductibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxableDeductibleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxableDeductibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
