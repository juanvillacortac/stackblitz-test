import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxableComponent } from './taxable.component';

describe('TaxableComponent', () => {
  let component: TaxableComponent;
  let fixture: ComponentFixture<TaxableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
