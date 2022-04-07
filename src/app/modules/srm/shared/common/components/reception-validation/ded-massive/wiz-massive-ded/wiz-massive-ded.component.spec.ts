import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizMassiveDedComponent } from './wiz-massive-ded.component';

describe('WizMassiveDedComponent', () => {
  let component: WizMassiveDedComponent;
  let fixture: ComponentFixture<WizMassiveDedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WizMassiveDedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizMassiveDedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
