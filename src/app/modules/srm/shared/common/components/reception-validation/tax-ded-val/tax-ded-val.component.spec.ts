import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxDedValComponent } from './tax-ded-val.component';

describe('TaxDedValComponent', () => {
  let component: TaxDedValComponent;
  let fixture: ComponentFixture<TaxDedValComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxDedValComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxDedValComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
