import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPlansDetailComponent } from './production-plans-detail.component';

describe('ProductionPlansDetailComponent', () => {
  let component: ProductionPlansDetailComponent;
  let fixture: ComponentFixture<ProductionPlansDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionPlansDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionPlansDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
