import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuttingOrdersListComponent } from './cutting-orders-list.component';

describe('CuttingOrdersListComponent', () => {
  let component: CuttingOrdersListComponent;
  let fixture: ComponentFixture<CuttingOrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuttingOrdersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuttingOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
