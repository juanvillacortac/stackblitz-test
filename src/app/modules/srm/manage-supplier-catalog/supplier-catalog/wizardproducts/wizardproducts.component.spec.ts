import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardproductsComponent } from './wizardproducts.component';

describe('WizardproductsComponent', () => {
  let component: WizardproductsComponent;
  let fixture: ComponentFixture<WizardproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WizardproductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
