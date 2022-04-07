import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductibleHeaderComponent } from './deductible-header.component';

describe('DeductibleHeaderComponent', () => {
  let component: DeductibleHeaderComponent;
  let fixture: ComponentFixture<DeductibleHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductibleHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeductibleHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
