import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxableHeaderComponent } from './taxable-header.component';

describe('TaxableHeaderComponent', () => {
  let component: TaxableHeaderComponent;
  let fixture: ComponentFixture<TaxableHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxableHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
