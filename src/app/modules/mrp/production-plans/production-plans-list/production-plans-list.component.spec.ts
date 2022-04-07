import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPlansListComponent } from './production-plans-list.component';

describe('ProductionPlansListComponent', () => {
  let component: ProductionPlansListComponent;
  let fixture: ComponentFixture<ProductionPlansListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionPlansListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionPlansListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
