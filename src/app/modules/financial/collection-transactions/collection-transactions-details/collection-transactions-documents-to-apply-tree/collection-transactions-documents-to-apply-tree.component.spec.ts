import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTransactionsDocumentsToApplyTreeComponent } from './collection-transactions-documents-to-apply-tree.component';

describe('CollectionTransactionsDocumentsToApplyTreeComponent', () => {
  let component: CollectionTransactionsDocumentsToApplyTreeComponent;
  let fixture: ComponentFixture<CollectionTransactionsDocumentsToApplyTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionTransactionsDocumentsToApplyTreeComponent ]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTransactionsDocumentsToApplyTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
