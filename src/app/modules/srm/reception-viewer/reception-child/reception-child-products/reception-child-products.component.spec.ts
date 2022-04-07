import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionChildProductsComponent } from './reception-child-products.component';

describe('ReceptionChildProductsComponent', () => {
  let component: ReceptionChildProductsComponent;
  let fixture: ComponentFixture<ReceptionChildProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionChildProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionChildProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
