import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuttingOrdersDetailComponent } from './cutting-orders-detail.component';

describe('CuttingOrdersDetailComponent', () => {
  let component: CuttingOrdersDetailComponent;
  let fixture: ComponentFixture<CuttingOrdersDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuttingOrdersDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuttingOrdersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
