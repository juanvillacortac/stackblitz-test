import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceGroupingListComponent } from './price-grouping-list.component';

describe('PriceGroupingListComponent', () => {
  let component: PriceGroupingListComponent;
  let fixture: ComponentFixture<PriceGroupingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceGroupingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceGroupingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
