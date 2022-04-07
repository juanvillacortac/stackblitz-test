import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangerateSuppliersComponent } from './exchangerate-suppliers.component';

describe('ExchangerateSuppliersComponent', () => {
  let component: ExchangerateSuppliersComponent;
  let fixture: ComponentFixture<ExchangerateSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangerateSuppliersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangerateSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
