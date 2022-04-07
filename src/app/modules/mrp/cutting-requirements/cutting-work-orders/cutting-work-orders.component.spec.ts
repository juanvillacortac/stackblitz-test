import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuttingWorkOrdersComponent } from './cutting-work-orders.component';

describe('CuttingWorkOrdersComponent', () => {
  let component: CuttingWorkOrdersComponent;
  let fixture: ComponentFixture<CuttingWorkOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuttingWorkOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuttingWorkOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
