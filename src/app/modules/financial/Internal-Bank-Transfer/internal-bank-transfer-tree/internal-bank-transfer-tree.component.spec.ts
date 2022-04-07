import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalBankTransferTreeComponent } from './internal-bank-transfer-tree.component';

describe('InternalBankTransferTreeComponent', () => {
  let component: InternalBankTransferTreeComponent;
  let fixture: ComponentFixture<InternalBankTransferTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalBankTransferTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalBankTransferTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
