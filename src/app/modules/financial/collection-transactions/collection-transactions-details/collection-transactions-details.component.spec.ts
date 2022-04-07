import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTransactionsDetailsComponent } from './collection-transactions-details.component';

describe('CollectionTransactionsDetailsComponent', () => {
  let component: CollectionTransactionsDetailsComponent;
  let fixture: ComponentFixture<CollectionTransactionsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionTransactionsDetailsComponent ]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTransactionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
