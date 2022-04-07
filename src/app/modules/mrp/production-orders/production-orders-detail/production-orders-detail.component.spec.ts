import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrdersDetailComponent } from './production-orders-detail.component';

describe('ProductionOrdersDetailComponent', () => {
  let component: ProductionOrdersDetailComponent;
  let fixture: ComponentFixture<ProductionOrdersDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionOrdersDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrdersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
