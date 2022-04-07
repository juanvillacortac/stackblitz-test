import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrdersListComponent } from './production-orders-list.component';

describe('ProductionOrdersListComponent', () => {
  let component: ProductionOrdersListComponent;
  let fixture: ComponentFixture<ProductionOrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionOrdersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
