import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardsupplierproductsComponent } from './wizardsupplierproducts.component';

describe('WizardsupplierproductsComponent', () => {
  let component: WizardsupplierproductsComponent;
  let fixture: ComponentFixture<WizardsupplierproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WizardsupplierproductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardsupplierproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
