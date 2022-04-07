import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTransactionsFiltersComponent } from './collection-transactions-filters.component';

describe('CollectionTransactionsFiltersComponent', () => {
  let component: CollectionTransactionsFiltersComponent;
  let fixture: ComponentFixture<CollectionTransactionsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionTransactionsFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTransactionsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
