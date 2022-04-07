import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTransactionsListComponent } from './collection-transactions-list.component';

describe('CollectionTransactionsListComponent', () => {
  let component: CollectionTransactionsListComponent;
  let fixture: ComponentFixture<CollectionTransactionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionTransactionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
