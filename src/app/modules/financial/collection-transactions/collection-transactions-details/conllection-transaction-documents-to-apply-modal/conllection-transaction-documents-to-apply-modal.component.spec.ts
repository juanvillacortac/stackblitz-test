import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConllectionTransactionDocumentsToApplyModalComponent } from './conllection-transaction-documents-to-apply-modal.component';

describe('ConllectionTransactionDocumentsToApplyModalComponent', () => {
  let component: ConllectionTransactionDocumentsToApplyModalComponent;
  let fixture: ComponentFixture<ConllectionTransactionDocumentsToApplyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConllectionTransactionDocumentsToApplyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConllectionTransactionDocumentsToApplyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
