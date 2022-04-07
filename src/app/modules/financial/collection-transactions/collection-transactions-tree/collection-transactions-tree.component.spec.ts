import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTransactionsTreeComponent } from './collection-transactions-tree.component';

describe('CollectionTransactionsTreeComponent', () => {
  let component: CollectionTransactionsTreeComponent;
  let fixture: ComponentFixture<CollectionTransactionsTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionTransactionsTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTransactionsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
