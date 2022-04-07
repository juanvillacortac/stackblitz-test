import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalBankTransferDetailComponent } from './internal-bank-transfer-detail.component';

describe('InternalBankTransferDetailComponent', () => {
  let component: InternalBankTransferDetailComponent;
  let fixture: ComponentFixture<InternalBankTransferDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalBankTransferDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalBankTransferDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
