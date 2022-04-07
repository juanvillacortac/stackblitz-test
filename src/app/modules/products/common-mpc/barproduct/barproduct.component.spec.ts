import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarproductComponent } from './barproduct.component';

describe('BarproductComponent', () => {
  let component: BarproductComponent;
  let fixture: ComponentFixture<BarproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarproductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
