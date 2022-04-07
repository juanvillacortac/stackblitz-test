import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedProductSearchComponent } from './advanced-product-search.component';

describe('AdvancedProductSearchComponent', () => {
  let component: AdvancedProductSearchComponent;
  let fixture: ComponentFixture<AdvancedProductSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedProductSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedProductSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
