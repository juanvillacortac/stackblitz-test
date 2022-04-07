import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsingmentInvoiceFilterComponent } from './consingment-invoice-filter.component';

describe('ConsingmentInvoiceFilterComponent', () => {
  let component: ConsingmentInvoiceFilterComponent;
  let fixture: ComponentFixture<ConsingmentInvoiceFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsingmentInvoiceFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsingmentInvoiceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
