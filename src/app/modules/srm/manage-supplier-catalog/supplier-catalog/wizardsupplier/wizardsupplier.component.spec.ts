import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardsupplierComponent } from './wizardsupplier.component';

describe('WizardsupplierComponent', () => {
  let component: WizardsupplierComponent;
  let fixture: ComponentFixture<WizardsupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WizardsupplierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardsupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
