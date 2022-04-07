import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizMasivTaxComponent } from './wiz-masiv-tax.component';

describe('WizMasivTaxComponent', () => {
  let component: WizMasivTaxComponent;
  let fixture: ComponentFixture<WizMasivTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WizMasivTaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizMasivTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
