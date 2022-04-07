import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionTotalProductsComponent } from './reception-total-products.component';

describe('ReceptionTotalProductsComponent', () => {
  let component: ReceptionTotalProductsComponent;
  let fixture: ComponentFixture<ReceptionTotalProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionTotalProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionTotalProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
