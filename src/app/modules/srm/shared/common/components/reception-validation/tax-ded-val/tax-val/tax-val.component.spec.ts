import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxValComponent } from './tax-val.component';

describe('TaxValComponent', () => {
  let component: TaxValComponent;
  let fixture: ComponentFixture<TaxValComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxValComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxValComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
