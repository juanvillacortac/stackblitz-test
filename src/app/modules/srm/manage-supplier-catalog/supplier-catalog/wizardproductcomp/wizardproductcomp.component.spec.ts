import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardproductcompComponent } from './wizardproductcomp.component';

describe('WizardproductcompComponent', () => {
  let component: WizardproductcompComponent;
  let fixture: ComponentFixture<WizardproductcompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WizardproductcompComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardproductcompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
