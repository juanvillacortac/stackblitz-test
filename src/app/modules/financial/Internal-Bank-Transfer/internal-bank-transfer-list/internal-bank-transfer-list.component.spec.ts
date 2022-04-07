import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalBankTransferListComponent } from './internal-bank-transfer-list.component';

describe('InternalBankTransferListComponent', () => {
  let component: InternalBankTransferListComponent;
  let fixture: ComponentFixture<InternalBankTransferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalBankTransferListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalBankTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
