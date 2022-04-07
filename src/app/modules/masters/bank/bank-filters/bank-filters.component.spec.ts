import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankFiltersComponent } from './bank-filters.component';

describe('BankFiltersComponent', () => {
  let component: BankFiltersComponent;
  let fixture: ComponentFixture<BankFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
