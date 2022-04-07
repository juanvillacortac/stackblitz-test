import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsigmentInvoicePanelComponent } from './consigment-invoice-panel.component';

describe('ConsigmentInvoicePanelComponent', () => {
  let component: ConsigmentInvoicePanelComponent;
  let fixture: ComponentFixture<ConsigmentInvoicePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsigmentInvoicePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsigmentInvoicePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
