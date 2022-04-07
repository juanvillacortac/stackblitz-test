import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedProductSearchFilterComponent } from './advanced-product-search-filter.component';

describe('AdvancedProductSearchFilterComponent', () => {
  let component: AdvancedProductSearchFilterComponent;
  let fixture: ComponentFixture<AdvancedProductSearchFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedProductSearchFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedProductSearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
