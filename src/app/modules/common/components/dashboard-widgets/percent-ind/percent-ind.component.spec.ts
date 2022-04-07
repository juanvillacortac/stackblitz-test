import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentIndComponent } from './percent-ind.component';

describe('PercentIndComponent', () => {
  let component: PercentIndComponent;
  let fixture: ComponentFixture<PercentIndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PercentIndComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentIndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
