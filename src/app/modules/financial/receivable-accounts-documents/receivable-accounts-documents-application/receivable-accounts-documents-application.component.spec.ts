import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableAccountsDocumentsApplicationComponent } from './receivable-accounts-documents-application.component';

describe('ReceivableAccountsDocumentsApplicationComponent', () => {
  let component: ReceivableAccountsDocumentsApplicationComponent;
  let fixture: ComponentFixture<ReceivableAccountsDocumentsApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivableAccountsDocumentsApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivableAccountsDocumentsApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
