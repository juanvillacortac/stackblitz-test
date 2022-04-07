import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseHeaderComponent } from './purchase-header.component';

describe('PurchaseHeaderComponent', () => {
  let component: PurchaseHeaderComponent;
  let fixture: ComponentFixture<PurchaseHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
