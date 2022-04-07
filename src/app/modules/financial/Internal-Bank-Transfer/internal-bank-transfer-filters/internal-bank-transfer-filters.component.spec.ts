import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalBankTransferFiltersComponent } from './internal-bank-transfer-filters.component';

describe('InternalBankTransferFiltersComponent', () => {
  let component: InternalBankTransferFiltersComponent;
  let fixture: ComponentFixture<InternalBankTransferFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalBankTransferFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalBankTransferFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
