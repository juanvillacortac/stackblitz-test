import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTransactionsSelectModalComponent } from './collection-transactions-select-modal.component';

describe('CollectionTransactionsSelectModalComponent', () => {
  let component: CollectionTransactionsSelectModalComponent;
  let fixture: ComponentFixture<CollectionTransactionsSelectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionTransactionsSelectModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTransactionsSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
